import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import {evergreenLogger} from '../utils/loggers.mjs';

// Use StealthPlugin with puppeteer
puppeteer.use(StealthPlugin());

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
  // Add more user agents here
];

async function everRequest(pol, pod) {
  evergreenLogger.info(`Requesting Evergreen schedule for POL: ${pol} and POD: ${pod}`);

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

    await page.goto(`https://ss.shipmentlink.com/tvs2/jsp/TVS2_InteractiveSchedule.jsp?func=backValue&carrier=V&fm_w3a=N&oriCountry=&desCountry=&oriLocation=${pol}&desLocation=${pod}&departureDate=20240724&arrivalDate=00000000&oriLocationName=&desLocationName=&isReefer=N&oriEastWest=ALL&desEastWest=ALL&oriEastWestStr=&desEastWestStr=&departureYear=2024&departureMonth=07&departureDay=24&arriveYear=0000&arriveMonth=00&arriveDay=00&durationWeek=14&oriUseMode=I&desUseMode=I`, { waitUntil: 'networkidle2', timeout: 60000 });


    // CAPTCHA detection and handling (manual intervention needed)
    if (await page.$('iframe[src*="captcha"]')) {
      evergreenLogger.warn('CAPTCHA detected. Please solve it manually.');
      await page.waitForNavigation(); // Wait for user to solve CAPTCHA
    }

    await page.waitForSelector('input.ec-btn.ec-btn-default.ec-fs-16'); // Wait for the button to appear
    await page.click('input.ec-btn.ec-btn-default.ec-fs-16');

    // Wait for at least one element to be available in the DOM and visible
    await page.waitForSelector('span[ectype="modalbox"][title="Routing Details"]', { visible: true });

    await page.hover('span[ectype="modalbox"][title="Routing Details"]');

    await delay(2000); // Add a 2-second delay before clicking
    await page.click('span[ectype="modalbox"][title="Routing Details"]');

    await delay(2000); // Add a 2-second delay before clicking
    await page.waitForFunction(
      () => document.querySelector("#detailDiv > table > tbody") !== null,
      { timeout: 20000 }
    );


    // Extract the table content
    const tableContent = await page.evaluate(() => {
      const rows = document.querySelectorAll('#detailDiv > table > tbody tr');
      return Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return Array.from(cells).map(cell => cell.textContent.trim());
      });
    });


    //table content
    const scheduledata = JSON.stringify(tableContent, null, 2)

    return tableContent;
  } catch (error) {
    evergreenLogger.error('An error occurred:', error);
    return null ;
  } finally {
    // Close the browser
    await browser.close();
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Call the function with POL and POD values

async function fetchPortCode(portname) {
    
  const scope = "context";
  const search = portname;
  const action = "preLoad";
  const switchSql = "";
  const datasource = "bkLocations";
  const fromFirst = "true";

  const bodyData = `scope=${encodeURIComponent(scope)}&search=${encodeURIComponent(search)}&action=${encodeURIComponent(action)}&switchSql=${encodeURIComponent(switchSql)}&datasource=${encodeURIComponent(datasource)}&fromFirst=${encodeURIComponent(fromFirst)}`;

  const response = await fetch("https://ss.shipmentlink.com/servlet/TUF1_AutoCompleteServlet", {
    "headers": {
      "accept": "text/javascript,text/html,application/xml,text/xml,*/*",
      "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-call": "TUF1_AutoComplete",
      "x-requested-with": "XMLHttpRequest",
      "cookie": "JSESSIONID=46016E976297FFAC444469C3F1C51A5E.node5",
      "Referer": "https://ss.shipmentlink.com/tvs2/jsp/TVS2_InteractiveSchedule.jsp?func=backValue&carrier=V&fm_w3a=N&oriCountry=&desCountry=&oriLocation=TRMIR&desLocation=CNLMG&departureDate=20240726&arrivalDate=00000000&oriLocationName=MERSIN+%28TRMER%29+%5BZIP%3A33006%5D&desLocationName=LONGMEN+%5BZIP%3A317500%5D&isReefer=N&oriEastWest=&desEastWest=&oriEastWestStr=&desEastWestStr=&departureYear=2024&departureMonth=07&departureDay=26&arriveYear=&arriveMonth=&arriveDay=&durationWeek=28&oriUseMode=I&desUseMode=I",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": bodyData,
    "method": "POST"
  });
  
  const responseText = await response.text();

  
  // Decode the response text
  const decodedString = decodeJsonString(responseText);

  // Parse the JSON
  const parsedArray = JSON.parse(decodedString);
  const evergreencode = parsedArray[0][1];
  return evergreencode;

}


// Function to decode the URL-encoded parts
function decodeJsonString(jsonString) {
// Replace \x with % to prepare for decoding
const preDecoded = jsonString.replace(/\\x/g, '%');

// Decode the URL-encoded parts
return decodeURIComponent(preDecoded);
}

export default async function EvergreenRequest(pol,pod,todate,fromdate){
  if (!pol ||!pod ) {
    evergreenLogger.error('Error port name should exist');
    return null;
  }

  const poleverportcode = await fetchPortCode(pol);
  const podeverportcode = await fetchPortCode(pod);
  if (!poleverportcode ||!podeverportcode ) {
    evergreenLogger.error('Error evergreen port code fetch failed');
    return null;
  }
  const data = await everRequest(poleverportcode,podeverportcode,todate,fromdate)
  return data;
}

