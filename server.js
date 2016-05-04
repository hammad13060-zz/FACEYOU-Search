var express = require("express"),
    app = express(),
    bot = require('./bot.js');

var port = process.env.PORT || 8080;

app.use("", bot);

app.listen(port, function() {
  console.log("server listening on port " + port);
});
