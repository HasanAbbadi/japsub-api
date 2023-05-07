import fs from "fs";
import kitsu from "../scrapers/kitsu.js";
import data from "../data/kitsu.json" assert { type: "json" };

const Update = async () => {
  const newData = await kitsu.getTitles();
  const lastUpdate = new Date(data.last_updated);
  let count = 0;
  for (let i = 0; i < newData.length; i++) {
    const currUpdate = new Date(newData[i].date);
    if (currUpdate <= lastUpdate)
      return {
        msg: "Up to Date.",
      };
    count += 1;
    const { exists, index } = checkEntry(newData[i].title);
    if (exists) {
      await updateEntry(index, newData[i]);
    } else {
      await addEntry(newData[i]);
    }
    return {
      msg: "Updated.",
      count,
    };
  }
};
const checkEntry = (title) => {
  for (let i = 0; i < data.data.length; i++) {
    if (data.data[i].title == title) {
      return {
        exists: true,
        index: i,
      };
    }
  }
  return {
    exists: false,
    index: 0,
  };
};
const updateEntry = async (index, entry) => {
  data.data[index] = entry;
  data.data[index].subs = await kitsu.getSub(entry.url);
  updateFile(data.data[index].date, data);
};
const addEntry = async (entry) => {
  entry.subs = await kitsu.getSub(entry.url);
  data.data.push(entry);
  updateFile(entry.date, data);
};
const updateFile = (date, jsonData) => {
  // update to last file date instead of using new Date()
  // to avoid conflicting timezones and local clocks.
  data.last_updated = date;
  const json = JSON.stringify(jsonData, null, 2);
  fs.writeFile("data/kitsu.json", json, (err) => {
    console.error(err);
  });
};
export default Update;
