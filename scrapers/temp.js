// Packages
const fetch = require("node-fetch-commonjs");
const cheerio = require("cheerio");
const fuzzy = require("fuzzysort");
const { unzip } = require("unzipit");

// Get the final subtitle result
const getKitsu = async (title, episode) => {
  const kitsuUrl = await getKitsuUrl(title);
  return await getKitsuSub(kitsuUrl, episode);
};

// Fuzzy find a matching kitsunekko anime page.
const getKitsuUrl = async (title) => {
  const mainUrl = "https://kitsunekko.net";
  const leadUrl = "/dirlist.php?dir=subtitles%2Fjapanese%2F";

  const body = await getBody(mainUrl + leadUrl);
  const data = getTableData(body);

  const result = fuzzy.go(title, data, {
    key: "title",
    limit: 1,
  });

  if (!result[0]) return;
  const url = mainUrl + result[0].obj.url;
  return url;
};

// Fuzzy find a matching subtitle file inside the kitsu anime page.
const getKitsuSub = async (kitsuUrl, query) => {
  const mainUrl = "https://kitsunekko.net/";

  const body = await getBody(kitsuUrl);
  const data = getTableData(body);

  let result = fuzzy.go(query, data, {
    key: "title",
    limit: 1,
  });

  let url = mainUrl;

  if (!result[0]) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].title.includes(".zip")) {
        url += data[i].url;
        return await readFiles(url, query);
      }
    }
  }

  url += result[0].obj.url;
  return {
    url,
    name: result[0].target,
    body: await getBody(url)
  };
};

// Get the html text of a webpage
const getBody = async (url) => {
  const res = await fetch(url);
  return await res.text();
};

// Get the first row of a Table containing links in kitsunekko.net
const getTableData = (body) => {
  const $ = cheerio.load(body);
  const data = [];

  $("#flisttable > tbody > tr > td> a").each((_, el) => {
    data.push({
      title: $(el).find("strong").text(),
      url: $(el).attr("href"),
    });
  });

  return data;
};

// Look for files in Archive and return Blob of matching file.
async function readFiles(url, episode) {
  const { entries } = await unzip(url);

  let file;

  for (const [name] of Object.entries(entries)) {
    const result = fuzzy.single(episode, name);
    if (result) {
      file = {
        url: await entries[result.target].blob(),
        name: name,
      };
      break;
    }
  }

  return {
    name: file.name,
    body: await file.url.text(),
  };
}

module.exports = getKitsu;
