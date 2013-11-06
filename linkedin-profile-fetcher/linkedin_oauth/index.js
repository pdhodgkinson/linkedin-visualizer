var OAuth = require("oauth").OAuth;
/*
 "https://api.linkedin.com/uas/oauth/requestToken"
 , "https://api.linkedin.com/uas/oauth/accessToken"
 , linkedinConsumerKey
 , linkedinConsumerSecret
 , "1.0"
 , linkedinCallback
 , "HMAC-SHA1"
 */

module.exports = function(consumerKey, consumerSecret, token, secret) {
    var module = {},
        rootURL = 'http://api.linkedin.com/v1/',
        peopleAPI = 'people/',
        companyAPI = 'companies/'
        headers = {
            'x-li-format': 'json'
        },
        oa = new OAuth(
            "https://api.linkedin.com/uas/oauth/requestToken"
            , "https://api.linkedin.com/uas/oauth/accessToken"
            , consumerKey
            , consumerSecret
            , "1.0"
            , undefined
            , "HMAC-SHA1"
            , undefined
            , headers
        );

    module.api = {
        people: function(queryString, callback) {
            oa.get(rootURL + peopleAPI + "~:(" + queryString + ")",
                token,
                secret,
                function(error, data) {
                    console.log(data);
                    callback(data);
                }
            );
        },
        id: function(callback) {
          oa.get(rootURL + peopleAPI + "~:(id)",
            token,
            secret,
            function(error, data) {
              console.log(data);
              callback(data);
            }
          );
        },
        company: function(id, queryString, callback) {
          oa.get(rootURL + companyAPI + id + ":(" + queryString + ")",
            token,
            secret,
            function(error, data) {
              console.log(data);
              callback(data);
            }
          );
        }
    }

    return module;
}
