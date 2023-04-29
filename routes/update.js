const fs = require("fs");
const { getKitsuTitles, getTitleSub } = require("../scrapers/kitsu");
const data = require("../data/all.json");

const Update = async () => {
  const newData = await getKitsuTitles();

  const lastUpdate = new Date(data.last_updated);

  for (let i = 0; i < newData.length; i++) {
    const currUpdate = new Date(newData[i].date);
    if (currUpdate <= lastUpdate) return { msg: "Up to Date." };

    if (newData[i].title == data.data[i].title) {
      await updateEntry(i, newData[i]);
    } else {
      await addEntry(newData[i]);
    }

    return { msg: "Updated" };
  }
};

const updateEntry = async (index, entry) => {
  data.data[index] = entry;
  data.data[index].subs = await getTitleSub(entry.url);

  updateFile();
};
const addEntry = async (entry) => {
  data.data.push(entry);

  updateFile();
};

const updateFile = () => {
  // update to last file date instead of using new Date()
  // to avoid conflicting timezones and local clocks.

  data.last_updated = data.data[0].date

  const json = JSON.stringify(data, null, 2);
  fs.writeFile("data/all.json", json, (err) => {
    console.error(err);
  });
};

module.exports = Update;
