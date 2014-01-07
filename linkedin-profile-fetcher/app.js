/**
 * Module dependencies.
 */

//id = 63DO4DUYsc

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    api = require('./routes/api'),
    company = require('./routes/company'),
    http = require('http'),
    path = require('path'),
    auth = require('connect-auth'),
    OAuth = require('oauth').OAuth,
    liOauth = require('./linkedin_oauth');

//var myOauth = new liOauth('test', 'this', 'out');
//Todo: This is bad way to load a global config
var exampleKeys = require('./linkedin_config');
for (var key in exampleKeys) {
    global[key] = exampleKeys[key];
}

var app = express();

// all environments
app.set('port', process.env.PORT || 3003);
var linkedinCallback = 'http://localhost:' + app.get('port') + '/auth/linkedin_callback';
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
app.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        //TODO: figure out proper config for pre-configured values
        linkedinToken = req.getAuthDetails().linkedin_oauth_token;
        linkedinSecret = req.getAuthDetails().linkedin_oauth_token_secret;
    }


    if (typeof linkedinToken !== 'undefined' && typeof linkedinSecret !== 'undefined') {
        //console.log('yep authenticated');
        console.log('linkedin_token: ' + linkedinToken);
        console.log('linkedin_secret: ' + linkedinSecret);
        req.linkedInOAuth = new liOauth(linkedinConsumerKey,
            linkedinConsumerSecret,
            linkedinToken,
            linkedinSecret
        );

        if (typeof linkedinId !== 'undefined') {
            //set linked in ID if stored in config
            req.session.linkedInId = linkedinId;
        }

        if (typeof req.session.linkedInId === 'undefined') {
            console.log('Get user linkedinID');
            req.linkedInOAuth.api.id(function (data) {
                data = JSON.parse(data);
                req.session.linkedInId = data.id;
                console.log('Set linkedinID to: ' + data.id);
                next();
            });
        } else {
            next();
        }
    } else {
        console.log('not authenticated yet');
        next();
    }
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

/*
 var oa = new OAuth(
    "https://api.linkedin.com/uas/oauth/requestToken"
    , "https://api.linkedin.com/uas/oauth/accessToken"
    , linkedinConsumerKey
    , linkedinConsumerSecret
    , "1.0"
    , linkedinCallback
    , "HMAC-SHA1"
);
 */

app.get('/', routes.index);
app.get('/api/people', api.people);
//app.get('/users', user.list);
app.get('/user', user.index);
app.get('/user/details', user.detail);
app.get('/company/:id', company.details);
app.get('/login', function (req, res) {
    'use strict';
    if (req.isAuthenticated()) {
        res.redirect('/');
        res.end();

    } else {
        req.authenticate('linkedin', function (error, authenticated) {
            console.log(authenticated);
            if (error) {
                // Something has gone awry, behave as you wish.
                console.log(error);
                res.end();
            }

        });
    }
});

http.createServer(app).listen(app.get('port'), function () {
    'use strict';
    console.log('Express server listening on port ' + app.get('port'));
});
