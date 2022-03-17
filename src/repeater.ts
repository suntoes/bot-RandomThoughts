const puppeteer = require('puppeteer');
require('dotenv').config();

// global counter
let repeatLap = 0;

const customRepeater = async() => {
    // original function
    repeatLap++;
    console.log(`init cycle ${repeatLap}...`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(process.env.TWEET_URL);
    // closes the page and browser to avoid any memory error
    await setTimeout(async()=> {
        console.log(`cycle ${repeatLap} done...`);
        await page.close();
        await browser.close();
    }, 5000)
    // repeats the function completely at n time to avoid lapsing things
    await setTimeout(async()=> {
        await customRepeater();
    }, 20000)
}

// initial things
console.log('initializing repeater...');
customRepeater();