const mongoose = require("mongoose");

const objschema = mongoose.Schema({
  tweet_query: String,
});

module.exports = mongoose.model("objschema", objschema);
