
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
    , auth = require('connect-auth'),
    OAuth = require("oauth").OAuth;

var example_keys= require('./linkedin_config');
for(var key in example_keys) {
    global[key]= example_keys[key];
}

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
linkedinCallback= "http://localhost:" + app.get('port') + "/auth/linkedin_callback";
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(auth({strategies: auth.Linkedin({consumerKey: linkedinConsumerKey, consumerSecret: linkedinConsumerSecret, callback: linkedinCallback}),
    trace: true,
    logoutHandler: require('connect-auth/lib/events').redirectOnLogout("/")}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var oa = new OAuth(
    "https://api.linkedin.com/uas/oauth/requestToken"
    , "https://api.linkedin.com/uas/oauth/accessToken"
    , linkedinConsumerKey
    , linkedinConsumerSecret
    , "1.0"
    , linkedinCallback
    , "HMAC-SHA1"
);

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/login', function(req, res) {
    if( req.isAuthenticated()) {
        console.log(req.getAuthDetails());
        oa.get("http://api.linkedin.com/v1/people/~:(first-name,last-name,picture-url,summary,specialties,positions,skills)",
            req.getAuthDetails().linkedin_oauth_token,
            req.getAuthDetails().linkedin_oauth_token_secret,
            function(error, data) {
                oa.get("http://api.linkedin.com/v1/companies/20526:(id,name,ticker,description,website-url,industries,logo-url,square-logo-url)",
                    req.getAuthDetails().linkedin_oauth_token,
                    req.getAuthDetails().linkedin_oauth_token_secret,
                    function(error, data) {
                        console.log(error);
                        console.log(data);
                        res.send(data);
                    });

                console.log(error);
                console.log(data);
                res.contentType('application/xml');
                res.send(data);
            })

    } else {
    req.authenticate('linkedin', function(error, authenticated) {
        if( error ) {
            // Something has gone awry, behave as you wish.
            console.log( error );
            res.end();
        }

});
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
