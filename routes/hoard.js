var fs = require("fs");
const kitsu = require("../scrapers/kitsu");
const matchoo = require("../scrapers/matchoo");

const Hoard = async (source = "kitsu") => {
  let data;

  switch (source) {
    case "kitsu":
      data = await hoardKitsu();
      break;
    case "matchoo":
      data = await hoardMatchoo();
      break;
  }
  writeJSON(data, source);
};

const hoardKitsu = async () => {
  const data = await kitsu.getTitles();

  for (let i = 0; i < 8; i++) {
    const subs = await kitsu.getSub(data[i].url);
    data[i].subs = subs;
    console.log("finished " + (i + 1));
    console.log(((i + 1) / data.length) * 100 + "%");
  }

  return data;
};

const hoardMatchoo = async () => {
  return await matchoo.getTitles();
};

const writeJSON = (data, file) => {
  const final = {
    last_updated: new Date(),
    data,
  };

  const json = JSON.stringify(final, null, 2);
  fs.writeFile(`data/${file}.json`, json, (err) => {
    console.error(err);
  });
};

module.exports = Hoard;
