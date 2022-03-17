<img src="https://raw.githubusercontent.com/suntoes/bot-RandomThoughts/master/functions/src/img/icon.png?token=GHSAT0AAAAAABRECJQ3UHWNZCHA77SMQPTEYRS4D5A" alt="r-bot/RandomThoughts logo" width="120"/>

# bot/RandomThoughts

<a href="https://twitter.com/rndm_thghts_bot">
<img src="https://raw.githubusercontent.com/suntoes/bot-RandomThoughts/master/functions/src/img/banner.png?token=GHSAT0AAAAAABRECJQ3XJEYBRCPBKWVF4IKYRS4GBQ" alt="banner" width="400"/>
</a>

## A reddit to twitter bot...
Using nodejs, it tweets recent r/RandomThoughts post's title detected with a condition of the author not being the AutoModerator, 
words being not less than 3, and overall character's length not more than 275.

## Host it locally...
To host it is very simple, but the requirements to run it is quite the different matter. Here's the full ordered list:

<details>
  <summary>1. Setting up with firebase</summary>
<br>

First off, have a clean directory for the project, and then run this on the terminal
  
```cmd
> firebase init functions
> ...initialize to a firebase project
> ...select TypeScript
> ...use ESlint? No
```
After that, you'd have to delete all the files inside the /functions folder, and then replace it in place with everything on this repo.

<hr>
</details>
<details>
  <summary>2. process.env variables</summary>
<br>

You'll be tasked to fill up the .env variables below and then place the .env file within the functions folder.

```js
CLIENT_ID="Your_Twitter's_Client_ID"
CLIENT_SECRET="Your_Twitter's_Client_Secret"
CALLBACK_URL="Your_Firestore_Callback_URL" // read note#1
TWEET_URL="Your_Firestore_Callback_URL" // read note#1
MONGO_URI="Your_MongoDb_URI" // read note#2
```
<b>note#1</b>: You'll need to run the scripts upto the firebase serve, and then see the console to get this. See the <i>scripts and commands</i> for the idea.
  
<b>note#2</b>: Initial  document in the database is crucial. Set it up by adding a "bot-datas" collection in your referred database. And then manually insert a document with { name: "random-thoughts", data: [ ] }.
  
<hr>
</details>
<details>
  <summary>3. scripts and commands</summary>
<br>

cd first to the /functions folder, and then here's the ordered scripts you'd need to run:

```cmd
> npm install
  ...
> npm run build
  ...
> firebase serve
  ...
> npm run repeater
```
You'll need a 2nd terminal for the repeater. And btw wait for each scripts to finish, before applying what follows. 

<hr>
</details>
