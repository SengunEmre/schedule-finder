import puppeteer from 'puppeteer-extra';

import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());


const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
  // Add more user agents here
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  console.log('Chrome launched');

  const page = await browser.newPage();

  await page.setViewport({
    width: 1280, // width of viewport in pixels
    height: 800, // height of viewport in pixels
    deviceScaleFactor: 1, // Device scale factor (can be thought of as dpr or zoom level)
  });
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  await page.setUserAgent(randomUserAgent);

  await page.setExtraHTTPHeaders({
    'upgrade-insecure-requests': '1',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,en;q=0.8'
  });

  console.log('New page created');

  try {
    await page.goto('https://www.cma-cgm.com/ebusiness/schedules', { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Page loaded');
    await page.screenshot({ path: 'test.png' });

    // CAPTCHA detection and handling
    if (await page.$('iframe[src*="captcha"]')) {
      console.log('CAPTCHA detected. Please solve it manually.');
      await page.waitForNavigation(); // Wait for user to solve CAPTCHA
    }

    // Fill POL input field
    const pol = 'ESBCN';
    await page.waitForSelector('#AutoCompletePOL', { timeout: 60000 });
    await page.type('#AutoCompletePOL', pol);
    console.log('POL Filled...');

    // Simulate human delay
    await delay(2000);

    // Wait for POL suggestion to appear and click on it
    await page.waitForSelector(`#sortedAutocompletePopup-AutoCompletePOL > ul > li.places-codes-wrapper > div > span:has-text("${pol}")`, { timeout: 60000 });
    await page.click(`#sortedAutocompletePopup-AutoCompletePOL > ul > li.places-codes-wrapper > div > span:has-text("${pol}")`);
    console.log('POL Selected');

    // Simulate human delay
    await delay(2000);

    // Fill POD input field
    const pod = 'TRALI';
    await page.waitForSelector('#AutoCompletePOD', { timeout: 60000 });
    await page.type('#AutoCompletePOD', pod);
    console.log('POD Filled...');

    // Simulate human delay
    await delay(2000);

    // Wait for POD suggestion to appear and click on it
    await page.waitForSelector(`#sortedAutocompletePopup-AutoCompletePOD > ul > li.places-codes-wrapper > div > span:has-text("${pod}")`, { timeout: 60000 });
    await page.click(`#sortedAutocompletePopup-AutoCompletePOD > ul > li.places-codes-wrapper > div > span:has-text("${pod}")`);
    console.log('POD Selected');

    // Simulate human delay
    await delay(2000);

    // Click on search button
    await page.click('#searchSchedules');
    console.log('SEARCHING SCHEDULES...');

    // Wait for schedules to load
    await page.waitForSelector('#DepartureDates_2 > div > a.capsule-container', { timeout: 10000 });
    console.log('SCHEDULES LOADED');

    // Take a screenshot
    await page.screenshot({ path: 'example3.png' });
    console.log('Screenshot captured');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();
