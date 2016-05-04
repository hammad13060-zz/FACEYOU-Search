var express = require("express"),
    app = express(),
    bot = require('./controller/bot.js');

var port = process.env.PORT || 8080;

app.use("/webhook", bot);

app.listen(port, function() {
  console.log("server listening on port " + port);
});
