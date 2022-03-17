const functions = require('firebase-functions');
require('dotenv').config();
import { generateData } from "./filterDb";

// access to firestore
const admin = require('firebase-admin');
admin.initializeApp();

// reference to doc in database
const dbRef = admin.firestore().doc('tokens/demo');

// twitter api stuff
const TwitterApi = require('twitter-api-v2').default;

// 1 - generate twitter authlink
exports.auth = functions.https.onRequest(async(req, res) => {

    // twitter access
    const twitterClient = new TwitterApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });
    
    const callbackURL = process.env.CALLBACK_URL;

    // generate twitter authlink with twitter permissions
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
        callbackURL,
        { scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] }
    );

    // store things from twitter authlink at firestore db for step 2
    await dbRef.set({ codeVerifier, state });

    // callback response
    res.redirect(url);

});

// 2 - handle the twitter authlink callback
exports.callback = functions.https.onRequest(async(req, res):Promise<any> => {

    // checks if callback query is same as for the generated version in authlink
    const { state, code } = req.query;
    const dbSnapshot = await dbRef.get();
    const { codeVerifier, state: storedState } = dbSnapshot.data();

    if(state !== storedState) {
        return res.status(400).send("Stored tokens didn't match");
    }

    // twitter access
    const twitterClient = new TwitterApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });

    const callbackURL = process.env.CALLBACK_URL;

    // twitter login and fetch tokens
    const {
        accessToken,
        refreshToken
    } = await twitterClient.loginWithOAuth2(({
        code,
        codeVerifier,
        redirectUri: callbackURL
    }));

    await dbRef.set({ accessToken, refreshToken });

    // sends ok signal
    res.sendStatus(200);
});

// 3 - generate data and tweet
exports.tweet = functions.https.onRequest(async(_req, res):Promise<any> => {

    // generate data and check if it's new
    const generatedData:Promise<false | string> = await generateData();
    if(await generatedData === false) return res.send('no new data scrapped...');

    // twitter access
    const twitterClient = new TwitterApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });

    // generate new refreshed twitter token incase of idling and twitter re=login
    const { refreshToken } = (await dbRef.get()).data();
    const {
        client: refreshedClient, 
        accessToken,
        refreshToken: newRefreshToken
    } = await twitterClient.refreshOAuth2Token(refreshToken);

    // saves new twitter token
    await dbRef.set({ accessToken, refreshToken: newRefreshToken});

    // tweet function and the tweet's text as response
    const { data } = await refreshedClient.v2.tweet(generatedData); 

    res.send(data.text);
});
