var unirest = require('unirest');
var fbCredentials = require("./fb_credentials.js");

module.exports = {
  sendMessage: function(videoResources, user_id) {
    message = createMessage(videoResources, user_id);
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
    genericTemplate = createGenericTemplate(videoResources, user_id);
    var elements = createElementList(videoResources);
    genericTemplate.message.attachment.payload.elements = elements;

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
      return genericTemplate;
    }
  },

  createGenericTemplate: function(videoResources, user_id) {
    tmplate = {
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

    return template;
  },

  createElementList: function(videoResources) {
    var elements = [];
    for (i = 0; i < videoResources.length; i++) {
      elements.push(createElemetTemplate(videoResources[i]));
    }
    return elements;
  },

  createElemetTemplate: function(videoResource) {
    return {
      title: videoResource.snippet.title,
      image_url: videoResource.snippet.thumbnails.any.url,
      buttons: createButton(videoResource.id.videoId)
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
