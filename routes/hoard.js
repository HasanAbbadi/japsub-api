import * as kitsu from "../scrapers/kitsu.js";
import * as matchoo from "../scrapers/matchoo.js";
import dotenv from "dotenv"
dotenv.config()
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
  await writeJSON(data, source);
};

const hoardKitsu = async (limit) => {
  const data = await kitsu.getTitles();
  if (!limit) limit = data.length;
  for (let i = 0; i < limit; i++) {
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

const writeJSON = async (data, source) => {
  const info = {}
  info[source] = data
  console.log(info)
  await kv.set("last_updated", new Date().toDateString());
  await kv.set("data", data)
};

export default Hoard;
