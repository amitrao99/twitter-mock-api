const express = require("express");
const { type } = require("os");
const path = require("path");
const TwitterClient = require("twitter-api-client");
const mongoose = require("mongoose");
const { resolve } = require("path");

const objschema = require("./model.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const twitterClient = new TwitterClient.TwitterClient({
  apiKey: "0cvefmkD6nYVaikRvoaPJffHt",
  apiSecret: "iO3OzNZQceUo5Q6NqjdlWS7qBFFTHBKUojxuDemxesfKgoeD0C",
  accessToken: "1348608347138715650-IInM2zlIUtiZ9sEJFSVGxGnfc94sON",
  accessTokenSecret: "rtSYdVEm4lvTXQWTZwM7aQEuzrIhfKLEFZi8FGaWLx81q",
});

mongoose
  .connect(
    "mongodb+srv://m001-student:m001-student@twitter-api-mongodb.3lxmz.mongodb.net/twitter-api-mongodb-database?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("database is synced");
    async function f(queryparams) {
      var data;
      if (queryparams.mode == "description") {
        var qq = queryparams.description;
        if (queryparams.name != "") {
          qq = qq.concat(" from: ");
          qq.concat(queryparams.name);
        }
        var location = queryparams.location;
        var _since_id = queryparams._since_id;
        if (location == "") {
          if (_since_id == "") {
            data = await twitterClient.tweets.search({
              q: qq,
              count: 5,
            });
          } else {
            data = await twitterClient.tweets.search({
              q: qq,
              since_id: _since_id,
              count: 5,
            });
          }
        } else {
          if (date == "") {
            data = await twitterClient.tweets.search({
              q: qq,
              locate: location,
              count: 5,
            });
          } else {
            data = await twitterClient.tweets.search({
              q: qq,
              locate: location,
              since_id: _since_id,
              count: 5,
            });
          }
        }
      }
      if (queryparams.mode == "user") {
        var _user_id = queryparams.user_id;
        var _screen_name = queryparams.screen_name;
        var _since_id = queryparams.since_id;
        data = await twitterClient.tweets.statusesUserTimeline({
          user_id: _user_id,
          screen_name: _screen_name,
          since_id: _since_id,
          count: 5,
        });
      }
      if (queryparams.mode == "tweet") {
        data = await twitterClient.tweets.statusesLookup({
          id: queryparams.id,
          count: 5,
        });
      }
      return data;
    }
    app.post("/query", (req, res) => {
      console.log(req.body);
      f(req.body).then((data) => {
        console.log("var DATA = ", data);
        if (typeof data != Object) {
          var mydata = JSON.stringify(data);
          var newdata = new objschema({
            tweet_query: mydata,
          });
          newdata
            .save()
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
        } else {
          console.log("no query returned!!!!!");
        }
      });
      res.redirect("/");
    });
    app.use("/", express.static(path.join(__dirname, "")));

    app.listen(process.env.PORT || 1113, () =>
      console.log("Website open on http://localhost:1113")
    );
  })
  .catch((err) => console.log(err));
