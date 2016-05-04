var unirest = require('unirest'),
    async = require('async'),
    server_api_key = require('./google_credentials.js').api_key;

module.exports = {
  querySearchAPI: function(query, callback) {
      unirest
        .get("https://www.googleapis.com/youtube/v3/search")
        .qs(getOptions(query))
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

/*var YoutubeSearch = function(queries) {
  this.queries = queries;
  this.response = [];
}

YoutubeSearch.prototype = {

  // function fetching query results for an array of queries
  search: function(callback) {
    async.each(this.queries, this.queryAPI, function(err) {
        if (err) {
          return callback(err);
        }
        callback(null, this.response);
    });
  },

  // function fetching search results for given query
  querySearchAPI: function(query, callback) {
      var options = {
        q: query,
        type: "video",
        videoDefinition: "any",
        order: "relevance",
        maxResults: 10
      };

      unirest
        .get("https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.search.list")
        .qs(options)
        .end(function(response) {
          if (response.statusType === 2) {
            callback(false, response.body.items);
          } else {
            callback(true);
          }
        });
  }
}*/
