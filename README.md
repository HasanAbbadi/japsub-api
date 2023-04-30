# JapSub-Api
An api that collects data from multiple sites, providing an easy way to find japanese
subtitles for your shows.
## Usage:
There are three routes to this api:

* `/hoard`:      Build the database.
* `/update`:     Update the databse.
* `/search`:     Fuzzy find files and archives stored in the DB.

## Installation
```shell
git clone https://github.com/HasanAbbadi/japsub-api
cd japsub-api
npm install
npm run start
```

the api will start at port 4500 by default.
