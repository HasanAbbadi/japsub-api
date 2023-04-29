var fs = require("fs");
const { getKitsuTitles, getTitleSub } = require("../scrapers/kitsu");

const Hoard = async () => {
  const data = await getKitsuTitles();

  for (let i = 0; i < 5; i++) {
    const subs = await getTitleSub(data[i].url);
    data[i].subs = subs;
    console.log("finished " + (i + 1));
    console.log(((i + 1) / data.length) * 100 + "%");
  }

  writeJSON(data);
};

const writeJSON = (data) => {
  const final = {
    last_updated: new Date(),
    data,
  };

  const json = JSON.stringify(final, null, 2);
  fs.writeFile("data/all.json", json, (err) => {
    console.error(err);
  });
};

module.exports = Hoard