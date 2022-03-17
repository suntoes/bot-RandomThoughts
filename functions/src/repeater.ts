const puppeteer = require('puppeteer');
require('dotenv').config();

// global counter
let repeatLap = 0;

const customRepeater = async() => {
    // original function
    repeatLap++;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(`init cycle ${repeatLap}...`);
    await page.goto(process.env.TWEET_URL);
    // closes the page and browser to avoid any memory error
    setTimeout(async()=> {
        console.log(`cycle ${repeatLap} done...`);
        await page.close();
        await browser.close();
    }, 15000)
    // repeats the function completely at n time to avoid lapsing things
    setTimeout(async()=> {
        await customRepeater();
    }, 30000)
}

// initial things
customRepeater();
console.log('initializing repeater...');