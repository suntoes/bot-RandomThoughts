const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

// the old reddit web scrapping factory
async function scrape():Promise<Array<any>> {
  // initial data
  const data = {};
  const filteredData:Array<any> = [];
  // puppeteer in action
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://old.reddit.com/r/RandomThoughts/new');
  const loadedPage = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML
    };
  });
  // cheerio in action
  const $ = cheerio.load(loadedPage.html);
  // iterate cheerio obj to get post values for data
  $("p.title a.title").each((i, elm)=>{
    const post = $(elm);
    const quote = post.text();
    const url = post.attr('href');
    data[i] = {};
    data[i].quote = quote;
    data[i].url = 'https://www.reddit.com' + url;
  });
  $("p.tagline a.author").each((i, elm)=>{
    const author = $(elm).text();
    data[i].author = author;
  });

  // browser disposal
  await browser.close();
  
  // filters unwanted data + convert into quote with author format
  for(let n in data) {
    if (data[n].author !== 'AutoModerator') {
      if(data[n].author.length + data[n].quote.length <= 273 && data[n].quote.split(" ").length >= 3) {
        const textFormat = `"${data[n].quote}"\n\n~u/${data[n].author}`
        filteredData.push(textFormat);
      }
    }
  }

  // returns array of filtered data
  return filteredData;
};

export { scrape }