import fetch from 'node-fetch';
import cheerio  from 'cheerio';




const url = "https://www.pilship.com/shared/ajax/?fn=get_schedule_porttoport&port_origin=BRSSZ&port_destination=VNCLI&date_from=2024-07-25&date_to=2024-08-01&_=1721837163264";

const options = {
  headers: {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "_gid=GA1.2.1382845065.1721802123; front_www_pilship_com=muff2virak2plsfq4n06frtuh0; _ga_M39J8YZNDE=GS1.1.1721836586.1.1.1721836646.0.0.0; _ga=GA1.2.1079756630.1688973015; TS01942ab8=011698f8e72f15e9c2763b5243a4291e8bacf195467247eaefb72cb88e36556b20709dae22e99eb4e0f35fc6658f598903daf329b18c3f2c2666b88807e7bb9cc072960918; TS00000000076=08c4718e7dab2800f153743d73f33d4fba70fd8c278910f950ade549a6f1a3f1742bcb241d588631929acd4c7fb7d30e0801149def09d0002fa8aa7a294a35f6c1bb926b454b0e7fc8811774601f351df644751efbbaa0d7f21f142e3281cc320abcbceab439c4257ac414daa854eb217e4b1519c6250925fb2de898173a5a8c9841383583011e05661f470560c15b1469523f1dc3b2e3539eadb3cd1b809991aefae1358c40adde794df485722d3629c5675e6c60396d2da274613917142f86b39585f60b1bca521e5b06027d49c601cff686c33b1f4063089eced8d0d1b1baf68003fa9242a4b481b2ed64d5cbb9e1e6a7b7a84b32b7bd5dbfb14d47318718cde245d1c8c0df04; TSPD_101_DID=08c4718e7dab2800f153743d73f33d4fba70fd8c278910f950ade549a6f1a3f1742bcb241d588631929acd4c7fb7d30e0801149def063800f52f2da19674f48e501026518d25bdca547917383a1f99146a506c768e4196fa9997971b5f95df656424a6f952732d3e473bbc69cad7aa6c; _gat=1; _ga_4WKQ02QBMZ=GS1.2.1721836570.157.1.1721837163.0.0.0; TS6e8b54cb027=08c4718e7dab2000a571dd65d288df2b00cef05ab9b9370f2a8104b740a5166c9f4e77ea33da18c40899a167f4113000a5aba501ccbad77fbe22c79875b934f28b1a32e8c48120120ee5569d57e4d9c0ce4fae009000d30d3c420ffb41a736fe",
    "Referer": "https://www.pilship.com/en-our-schedules-pil-pacific-international-lines/117.html",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  method: "GET"
};

fetch(url, options)  .then(response => response.json())
.then(data => {
  const $ = cheerio.load(data.data.main);
  const table = $('table'); // Adjust the selector as needed

  const headers = [];
  table.find('thead th').each((index, element) => {
    headers.push($(element).text().trim());
  });

  const rows = [];
  table.find('tbody tr').each((index, element) => {
    const row = {};
    $(element).find('td').each((i, elem) => {
      row[headers[i]] = $(elem).text().trim();
    });
    rows.push(row);
  });
  console.log(rows[0]["Port of Load"]);
})
.catch(error => console.error('Error:', error));