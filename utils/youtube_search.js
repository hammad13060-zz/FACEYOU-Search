var unirest = require('unirest'),
    server_api_key = require('../credentials/google_credentials.js').api_key;

module.exports = {
  querySearchAPI: function(query, callback) {
      unirest
        .get("https://www.googleapis.com/youtube/v3/search")
        .qs(this.getOptions(query))
        .end(function(response) {
          if (response.statusType === 2) {
            callback(false, response.body.items);
          } else {
            callback(true);
          }
        });
  },

  getOptions(query) {
    return {
      key: server_api_key,
      part: "snippet",
      q: query,
      type: "video",
      videoDefinition: "any",
      order: "relevance",
      maxResults: 10
    };
  }
}
