// Matchoo95/JP-Subtitles
const fetch = require("node-fetch-commonjs");

const mainUrl =
  "https://api.github.com/repos/Matchoo95/JP-Subtitles/git/trees/master?recursive=1";
const rawUrl =
  "https://raw.githubusercontent.com/Matchoo95/JP-Subtitles/master/";

const getTitles = async () => {
  const json = await getJson(mainUrl);
  return makeHierarchy(json.tree);
};

const makeHierarchy = (arr) => {
  const data = [];
  let parent = {};

  let children = [];

  for (let i = 0; i < arr.length; i++) {
    const isDescendant = arr[i].path.includes("/");
    const isBlob = arr[i].type === "blob";

    if (!isDescendant && !isBlob) {
      if (children.length > 0) {
        parent.subs = children;
        data.push(parent);
        children = [];
      }
      parent = extractFields(arr[i]);
    } else if (isDescendant && isBlob) {
      children.push(extractFields(arr[i]));
    }
  }

  return data;
};

const extractFields = (object) => {
  return {
    title: object.path,
    size: object.size,
    url: rawUrl + encodeURI(object.path),
    archive: false,
    date: "Apr 20, 2021, 12:09 PM GMT+3",
  };
};

// Get the json response of the api
const getJson = async (url) => {
  const res = await fetch(url);
  return await res.json();
};

module.exports = {
  getTitles,
};
