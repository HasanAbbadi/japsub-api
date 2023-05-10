import fuzzy from "fuzzysort";
import kv from "@vercel/kv"
let data = await kv.lrange(process.env.LIST_NAME || "subtitles", 0, -1)
data = data.flat(1)

const Search = (title, season, episode) => {
  season = parseInt(season);
  episode = parseInt(episode);
  const results = fuzzy.go(title, data, {
    key: "title",
    limit: 2,
  });
  const filter = [];
  for (let i = 0; i < results.length; i++) {
    let test = results[i].obj.subs?.filter((el) => {
      const title = cleanTitle(el.title);
      return checkSeason(title, season) && checkEpisode(title, episode);
    });
    if (!episode && !season) {
      test = results[i].obj;
    }
    filter.push(test);
  }
  return filter;
};
const cleanTitle = (sub) => {
  // other file extensions
  sub = sub.replace(/.*\.(txt|md|sup)$/, "");
  sub = sub.replace(/(1080p|720p|WEBRip|Netflix).*/, "");

  // get rid of dates and seasons
  sub = sub.replace(/[\[\(][0-9]*(\.|-)[0-9]*(\.|-)[0-9]*[\]\)]/, "");
  return sub;
};
const checkSeason = (sub, season) => {
  const singleRegex = new RegExp(`([Ss][Ee][Aa][Ss][Oo][Nn]|S).?${season}`);
  const singleMatch = singleRegex.exec(sub);
  if (singleMatch || !season) return true;
  return false;
};
const checkEpisode = (sub, episode) => {
  episode = parseInt(episode);
  sub = sub.replace(/([Ss][Ee][Aa][Ss][Oo][Nn]|[Ss]).?[0-9]*/g, "");
  const singleRegex = new RegExp(`[Ee]?(?<![0-9])0?(${episode})(?![0-9])`, "g");
  const singleMatch = singleRegex.exec(sub);
  const regionRegex = new RegExp("([0-9]*)(-|~)([0-9]*)", "g");
  const regionMatch = regionRegex.exec(sub);
  if (singleMatch || !episode) return true;
  if (regionMatch && regionMatch[1] && regionMatch[3]) {
    if (regionMatch[3] >= episode && regionMatch[1] <= episode) return true;
    return false;
  }
};
export default Search;
