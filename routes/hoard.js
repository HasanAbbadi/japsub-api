import fs from "fs";
import kitsu from "../scrapers/kitsu.js";
import matchoo from "../scrapers/matchoo.js";

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
  writeJSON(data, source);
};
const hoardKitsu = async limit => {
  const data = await kitsu.getTitles();
  if (!limit) limit = data.length;
  for (let i = 0; i < limit; i++) {
    const subs = await kitsu.getSub(data[i].url);
    data[i].subs = subs;
    console.log("finished " + (i + 1));
    console.log((i + 1) / data.length * 100 + "%");
  }
  return data;
};
const hoardMatchoo = async () => {
  return await matchoo.getTitles();
};
const writeJSON = (data, file) => {
  const final = {
    last_updated: new Date(),
    data
  };
  const json = JSON.stringify(final, null, 2);
  fs.writeFile(`data/${file}.json`, json, err => {
    console.error(err);
  });
};
export default Hoard;