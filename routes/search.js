const data = require("../data/all.json");
const fuzzy = require("fuzzysort");

const Search = (title, season, episode) => {
  const results = fuzzy.go(title, data.data, {
    key: "title",
    limit: 2,
  });

  const filter = [];

  for (let i = 0; i < results.length; i++) {
    let test = results[i].obj.subs?.filter((el) => {
      return checkSeason(el.title, season) && checkEpisode(el.title, episode);
    });

    if (!episode) {
      test = results[i].obj;
    }
    filter.push(test);
  }

  return filter;
};

const checkSeason = (sub, season) => {
  const singleRegex = new RegExp(`([Ss][Ee][Aa][Ss][Oo][Nn]|S).?${season}*`);
  const singleMatch = singleRegex.exec(sub);

  if (singleMatch) return true;
  return false;
};

const checkEpisode = (sub, episode) => {
  // other file extensions
  sub = sub.replace(/.*\.(txt|md)$/, "");
  sub = sub.replace(/(1080|720)p.*/, "")

  // get rid of dates and seasons
  sub = sub.replace(/([Ss][Ee][Aa][Ss][Oo][Nn]|S).?[0-9]*/, "");
  sub = sub.replace(/[\[\(][0-9]*(\.|-)[0-9]*(\.|-)[0-9]*[\]\)]/, "");

  const singleRegex = new RegExp(`[Ee]?(?<![0-9])0?(${episode})(?![0-9])`, "g");
  const singleMatch = singleRegex.exec(sub);

  const regionRegex = new RegExp("([0-9]*)(-|~)([0-9]*)", "g");
  const regionMatch = regionRegex.exec(sub);

  if (singleMatch) return true;
  if (regionMatch && regionMatch[1]) {
    return regionMatch[3] >= episode >= regionMatch[1];
  }
};

module.exports = Search;
