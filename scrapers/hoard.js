
const fetch = require("node-fetch-commonjs");
const cheerio = require("cheerio");

const getKitsuTitles = async () => {
  const mainUrl = "https://kitsunekko.net";
  const leadUrl = "/dirlist.php?dir=subtitles%2Fjapanese%2F";

  const body = await getBody(mainUrl + leadUrl);
  const data = getTableData(body);
}

// Get the html text of a webpage
const getBody = async (url) => {
  const res = await fetch(url);
  return await res.text();
};