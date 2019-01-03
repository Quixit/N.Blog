var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var crypto = require('crypto');

var config = require('../config');

var User = require('../model/user');
var Client = require('../model/client');
var AccessToken = require('../model/accessToken');
var RefreshToken = require('../model/refreshToken');

passport.use(new BasicStrategy(
    function(username, password, done) {
console.log('basic');
        Client.findOne({ clientId: username }, function(err, client) {
            if (err) {
            	return done(err);
            }

            if (!client) {
            	return done(null, false);
            }

            if (client.clientSecret !== password) {
            	return done(null, false);
            }

            return done(null, client);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
console.log('pass');
        Client.findOne({ clientId: clientId }, function(err, client) {
            if (err) {
            	return done(err);
            }

            if (!client) {
            	return done(null, false);
            }

            if (client.clientSecret !== clientSecret) {
            	return done(null, false);
            }

            return done(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function(token, done) {

      let key = '';
      let salt = '';

      if (token.length >= 64)
        salt = token.substring(0,64);

      if (token.length > 64)
        key = token.substring(64);

      const hash = crypto.createHmac('sha256', salt)
                 .update(key)
                 .digest('hex');

      AccessToken.findOne({ token: hash }, function(err, token) {

        if (err) {
        	return done(err);
        }

        if (!token) {
        	return done(null, false);
        }

        if( Math.round((Date.now()-token.created)/1000) > config.get('security:tokenLife') ) {

            AccessToken.deleteOne({ token: hash }, function (err) {
                if (err) {
                	return done(err);
                }
            });

            return done(null, false, { message: 'Token expired' });
        }

        User.findById(token.userId, function(err, user) {

            if (err) {
            	return done(err);
            }

            if (!user || user.inactive) {
            	return done(null, false, { message: 'Unknown user' });
            }

            var info = { scope: '*' };
            return done(null, user, info);
        });
    });
}));

module.exports = passport;
