import puppeteer from 'puppeteer-extra';
import fs from 'fs';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import { fileURLToPath } from 'url';

export default async function mscRequest(pol, pod) {
  
  console.log(`Requesting MSC schedule for POL: ${pol} and POD: ${pod}`);

  // Use StealthPlugin with puppeteer
  puppeteer.use(StealthPlugin());

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    // Add more user agents here
  ];

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true, // Set to true for production use, change to false for debugging
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });


  try {
    const page = await browser.newPage();

    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUserAgent);

    await page.setExtraHTTPHeaders({
      'upgrade-insecure-requests': '1',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9,en;q=0.8'
    });


    // Enable request interception
    await page.setRequestInterception(true);

    // Intercept the request and response
    page.on('request', request => {
      request.continue();
    });

    const responsePromise = new Promise((resolve, reject) => {
      page.on('response', async response => {
        try {
          if (response.url().includes('https://www.msc.com/api/feature/tools/SearchSailingRoutes')) {
            const data = await response.json();
            resolve(data);
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    await page.goto('https://www.msc.com/en/search-a-schedule', { waitUntil: 'networkidle2', timeout: 60000 });

    // CAPTCHA detection and handling (manual intervention needed)
    if (await page.$('iframe[src*="captcha"]')) {
      console.log('CAPTCHA detected. Please solve it manually.');
      await page.waitForNavigation(); // Wait for user to solve CAPTCHA
    }

    // Fill "From" input field
    const fromInputSelector = 'input[name="from"]';
    await page.waitForSelector(fromInputSelector);
    await page.type(fromInputSelector, pol);

    // Wait for the button to appear
    try {
      await page.waitForSelector('button.port', { timeout: 5000 }); // Wait for 5 seconds
    } catch (error) {
      throw new Error(`Timeout waiting for pol selection: ${error.message}`);
    }

    const FromportButtons = await page.$$('button.port'); // Get all buttons with class 'port'

    let buttonClicked = false;

    // Iterate through buttons to find the one with 'pol'
    for (const button of FromportButtons) {
      const buttonText = await page.evaluate(el => el.textContent.trim(), button);
      if (buttonText.includes(pol)) {
        await button.click(); // Click the button that includes 'pol'
        buttonClicked = true;
        break;
      }
    }

    if (!buttonClicked) {
      throw new Error(`Button with POL '${pol}' not found.`);
    }

    await delay(2000);

    // Fill "To" input field
    const toInputSelector = 'input[name="to"]';
    await page.waitForSelector(toInputSelector);
    await page.type(toInputSelector, pod);
    await page.waitForSelector('button.port'); // Wait for the button to appear
    await delay(500);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await delay(500);

    // Query
    await page.waitForSelector('button.msc-cta'); // Wait for the button to appear
    await page.click('button.msc-cta');

    // SEARCH BUTTON HAS BEEN PRESSED
    await delay(2000); // Wait for the network request and response to be captured

    const data = await responsePromise;

    // Optionally, return data or status here
    return data; // Example return value
  } catch (error) {
    console.error('An error occurred:', error);
    return null ;
    throw error; // Propagate the error to the caller

  } finally {
    // Close the browser
    await browser.close();
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
