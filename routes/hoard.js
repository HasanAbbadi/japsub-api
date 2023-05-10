import * as kitsu from "../scrapers/kitsu.js";
import * as matchoo from "../scrapers/matchoo.js";
import dotenv from "dotenv";
dotenv.config();
import kv from "@vercel/kv";

const Hoard = async (source = "kitsu", limit) => {
  let data;
  switch (source) {
    case "kitsu":
      data = await hoardKitsu(limit);
      break;
    case "matchoo":
      data = await hoardMatchoo();
      break;
  }
  //await writeJSON(data, source);
};

const hoardKitsu = async (limit) => {
  const data = await kitsu.getTitles();
  let list = [];
  if (!limit) limit = data.length;

  for (let i = 0; i < limit; i++) {
    const subs = await kitsu.getSub(data[i].url);
    data[i].subs = subs;
    list.push(data[i]);

    if (i % 150 === 0) {
      writeJSON(list, "kitsu");
      list = [];
    }

    console.log("finished " + (i + 1));
    console.log(((i + 1) / data.length) * 100 + "%");
  }
  return;
};

const hoardMatchoo = async () => {
  return await matchoo.getTitles();
};

const writeJSON = async (data, source) => {
  const info = {};
  info[source] = data;
  await kv.set("last_updated", new Date().toDateString());
  await kv.lpush(process.env.LIST_NAME || "subtitles", [...data]);
};

export default Hoard;
