import * as kitsu from "../scrapers/kitsu.js";
import dotenv from "dotenv"
dotenv.config()
import kv from "@vercel/kv";

let data = await kv.lrange(process.env.LIST_NAME || "subtitles", 0, -1);
data = data.flat(1)
const last_updated = await kv.get("last_updated");

const Update = async () => {
  const newData = await kitsu.getTitles();
  const lastUpdate = new Date(last_updated);
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
  for (let i = 0; i < data.length; i++) {
    if (data[i].title == title) {
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
  data[index] = entry;
  data[index].subs = await kitsu.getSub(entry.url);
  await updateFile(data[index].date, data);
};

const addEntry = async (entry) => {
  entry.subs = await kitsu.getSub(entry.url);
  data.push(entry);
  await updateFile(entry.date, data);
};

const updateFile = async (date, jsonData) => {
  // update to last file date instead of using new Date()
  // to avoid conflicting timezones and local clocks.
  await kv.set("last_updated", date);
  await kv.set("data", jsonData);
};
export default Update;
