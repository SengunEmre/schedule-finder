import fetch from 'node-fetch';
import {arkasLogger} from '../utils/loggers.mjs';

const baseUrl = 'https://webtracking.arkasline.com.tr/api/request/Get?controllerMethod=webtracking%2Fapi%2Fport%2FGetAllByKeyword&prms=';

const headers = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
  "cache-control": "no-cache",
  "correlationid": "7d7efd5f-f890-423b-9ad7-fa2d74e4e980",
  "culture": "en-US",
  "if-modified-since": "Mon, 26 Jul 1997 05:00:00 GMT",
  "pragma": "no-cache",
  "priority": "u=1, i",
  "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "cookie": "__utmz=230835535.1709288582.3.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=230835535.2106566428.1690361755.1709288582.1709293603.4; ApplicationGatewayAffinityCORS=a8947a733916473e4f9631c7c757cbe4; ApplicationGatewayAffinity=a8947a733916473e4f9631c7c757cbe4; ARRAffinity=52eed1d4bad3af19da0bcae7a2cf98309da60d1db6bc33aef89ca521897f539b; ARRAffinitySameSite=52eed1d4bad3af19da0bcae7a2cf98309da60d1db6bc33aef89ca521897f539b",
  "Referer": "https://webtracking.arkasline.com.tr/routefinder",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

async function fetchData(url) {
  try {
    const response = await fetch(url, { method: 'GET', headers: headers });
    const data = await response.json();
    return data;
  } catch (error) {
    arkasLogger.error('Error fetching data:', error);
    return null;
  }
}

function createUrl(portcode) {
  const params = encodeURIComponent(JSON.stringify({ keyword: portcode }));
  return `${baseUrl}${params}`;
}

async function getPortId(portcode) {
  const url = createUrl(portcode);
  try {
    const data = await fetchData(url);
    return data ? data.data[0].id : null;
  } catch (error) {
    arkasLogger.error("ARKAS DO NOT HAVE THE PORT " + portcode );
    return null;
  }
}

export default async function arkasRequest(pol, pod ,date) {
  try {
    let fromPortId = await getPortId(pol);
    let toPortId = await getPortId(pod);

    if (!fromPortId || !toPortId) {
      arkasLogger.error('PORTS ARE NOT VALID FOR ARKAS LINE');
      return null;
    }

    const departureDate = date;
    const noOfWeeks = "3";
    const requesturl = `https://webtracking.arkasline.com.tr/api/request/Get?controllerMethod=webtracking%2Fapi%2Froutefinder%2FGetVoyages&prms=${encodeURIComponent(JSON.stringify({
      fromPortId,
      toPortId,
      departureDate,
      noOfWeeks,
      pageIndex: 0,
      pageSize: 0
    }))}`;

    const response = await fetch(requesturl, { method: 'GET', headers: headers });
    const data = await response.json();
    if (!data || !data.data || !data.data.data || !data.data.data.length) {
      arkasLogger.error('Error: Invalid response data');
      return null;
    }
    const scheduledata = await fetchRouteDetails(data.data.data[0].voyageRouteId);
    return scheduledata;
  } catch (error) {
    arkasLogger.error('Error:', error);
    return null;
  }
}

async function fetchRouteDetails(voyageRouteId) {
  const params = encodeURIComponent(JSON.stringify({ voyageRouteId }));
  const requestUrl = `https://webtracking.arkasline.com.tr/api/request/Get?controllerMethod=webtracking%2Fapi%2Froutefinder%2FGetRouteDetails&prms=${params}`;

  try {
    const response = await fetch(requestUrl, { method: 'GET', headers: headers });
    const data = await response.json();
    return data ? data.data[0] : null;
  } catch (error) {
    arkasLogger.error('Error fetching route details:', error);
    return null;
  }
}
