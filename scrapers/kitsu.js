const fetch = require("node-fetch-commonjs");
const cheerio = require("cheerio");

const mainUrl = "https://kitsunekko.net";

const getTitles = async () => {
  const leadUrl = "/dirlist.php?dir=subtitles/japanese/&sort=date&order=desc";
  return await fetchTable(leadUrl)
}

const getSub = async (url) => {
  return await fetchTable(url + '/&sort=date&order=desc')
}

const fetchTable = async (url) => {
  const body = await getBody(mainUrl + url);
  return getTableData(body);
}

// Get the html text of a webpage
const getBody = async (url) => {
  const res = await fetch(url);
  return await res.text();
};

// Get the first row of a Table containing links in kitsunekko.net
const getTableData = (body) => {
  const $ = cheerio.load(body);
  const data = [];

  $("#flisttable > tbody > tr").each((_, el) => {
    const url =  $(el).find("td > a").attr("href")
    let isArchive = false
    if (url.includes(".rar") || url.includes(".7z") || url.includes(".zip")) isArchive = true
    data.push({
      title: $(el).find("td > a > strong").text(),
      size: $(el).find("td.tdleft").text().trim(),
      url,
      archive: isArchive,
      date: $(el).find("td.tdright").attr("title")
    });
  });

  return data;
};

module.exports = {
  getSub,
  getTitles
}