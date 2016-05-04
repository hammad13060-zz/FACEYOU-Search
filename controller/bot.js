var express = require('express'),
    router = express.Router(),
    ySearch = require('../utils/youtube_search.js'),
    fbMessage = require('../utils/fb_message.js'),
    fbCreds = require('../credentials/fb_credentials.js'),
    bodyParser = require('body-parser');


// callback url for server verification
router.get('/', function(req, res) {
  console.log('verification url');
  if (req.query['hub.verify_token'] === fbCreds.validation_token) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

// callback url to be invoked whenever message is received
router.post('/', bodyParser.json(), function(req, res) {
  console.log('new message url');
  messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    var event = messaging_events[i];
    var senderId = event.sender.id;
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
