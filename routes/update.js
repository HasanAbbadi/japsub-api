const fs = require("fs");
const { getKitsuTitles, getTitleSub } = require("../scrapers/kitsu");
const data = require("../data/all.json");

const Update = async () => {
  const newData = await getKitsuTitles();

  const lastUpdate = new Date(data.last_updated);

  const count = 0;
  for (let i = 0; i < newData.length; i++) {
    const currUpdate = new Date(newData[i].date);
    if (currUpdate <= lastUpdate) return { msg: "Up to Date." };

    count += 1;
    const { exists, index } = checkEntry(newData[i].title);
    if (exists) {
      await updateEntry(index, newData[i]);
    } else {
      await addEntry(newData[i]);
    }

    return { msg: "Updated.", count };
  }
};

const checkEntry = (title) => {
  for (let i = 0; i < data.length; i++) {
    if (data.data[i].title == title) {
      return { exists: true, index: i };
    }
  }
  return { exists: false, index: 0 };
};

const updateEntry = async (index, entry) => {
  data.data[index] = entry;
  data.data[index].subs = await getTitleSub(entry.url);

  updateFile(data.data[index].date);
};

const addEntry = async (entry) => {
  entry.subs = await getTitleSub(entry.url);
  data.data.push(entry);

  updateFile(entry.date);
};

const updateFile = (date) => {
  // update to last file date instead of using new Date()
  // to avoid conflicting timezones and local clocks.
  data.last_updated = date;

  const json = JSON.stringify(data, null, 2);
  fs.writeFile("data/all.json", json, (err) => {
    console.error(err);
  });
};

module.exports = Update;
