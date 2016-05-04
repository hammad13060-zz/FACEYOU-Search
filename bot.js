var express = require('express'),
    router = express.Router(),
    ySearch = require('./youtube_search.js'),
    fbMessage = require('./fb_message.js'),
    fbCreds = require('./fb_credentials.js');


// callback url for server verification
router.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] == fbCreds.validation_token) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

// callback url to be invoked whenever message is received
router.post('/webhook/', function(req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.lenght; i++) {
    event = req.body.entry[0].messaging[i];
    senderId = event.sender.id;
    if (event.message && event.message.text) {
      ySearch.querySearchAPI(event.message.text, function(err, videoResources) {
        if (err) {
          return console.log("search query failed!");
        }
        fbMessage.sendMessage(videoResources, senderId);
      });
    }
  }
  res.sendStatus(200);
});

module.exports = router;
