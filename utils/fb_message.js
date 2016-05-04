var unirest = require('unirest');
var fbCredentials = require("../credentials/fb_credentials.js");

module.exports = {
  sendMessage: function(videoResources, user_id) {
    message = this.createMessage(videoResources, user_id);
    unirest.post("https://graph.facebook.com/v2.6/me/messages?access_token=" + fbCredentials.page_access_token)
            .type('json')
            .send(message)
            .end(function(response) {
              if (response.body.hasOwnProperty('error')) {
                console.log('message falied!');
              } else {
                console.log("message sent!");
              }
            });
  },

  createMessage: function(videoResources, user_id) {
    genericTemplate = this.createGenericTemplate(user_id);
    var elements = this.createElementList(videoResources);

    if (elements.length === 0) {
      return {
        recipient: {
          id: user_id
        },
        message: {
          text: "no results found!"
        }
      };
    } else if (elements.length > 0) {
      genericTemplate.message.attachment.payload.elements = elements;
      return genericTemplate;
    }
  },

  createGenericTemplate: function(user_id) {
    return {
      recipient: {
        id: user_id
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type:"generic"
          }
        }
      }
    };
  },

  createElementList: function(videoResources) {
    var elements = [];
    for (var i = 0; i < videoResources.length; i++) {
      elements.push(this.createElementTemplate(videoResources[i]));
    }
    return elements;
  },

  createElementTemplate: function(videoResource) {
    return {
      title: videoResource.snippet.title,
      image_url: videoResource.snippet.thumbnails.default.url,
      buttons: this.createButton(videoResource.id.videoId)
    };
  },

  createButton: function(videoId) {
    return [{
      type: "web_url",
      url: "https://www.youtube.com/watch?v=" + videoId,
      title: "Watch"
    }];
  }
}
