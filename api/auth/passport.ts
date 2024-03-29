import passport from 'passport';
import basic from 'passport-http';
import oauth2 from 'passport-oauth2-client-password';
import bearer from 'passport-http-bearer';
const BasicStrategy = basic.BasicStrategy;
const ClientPasswordStrategy = oauth2.Strategy;
const BearerStrategy = bearer.Strategy;
import crypto from 'crypto';

import config from '../config';
import User, { UserDocument } from '../model/user';
import Client, { ClientDocument } from '../model/client';
import AccessToken, { AccessTokenDocument } from '../model/accessToken';
import { CallbackError } from 'mongoose';

passport.use(new BasicStrategy(
    function(username, password, done) {

        Client.findOne({ clientId: username }, function(err: CallbackError, client: ClientDocument) {
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

        Client.findOne({ clientId: clientId }, function(err: CallbackError, client: ClientDocument) {
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

      AccessToken.findOne({ token: hash }, function(err: CallbackError, token: AccessTokenDocument) {

        if (err) {
        	return done(err);
        }

        if (!token) {
        	return done(null, false);
        }

        if( Math.round((Date.now()-Number(token.created))/1000) > config.get('security:tokenLife') ) {

            AccessToken.deleteOne({ token: hash }, function (err) {
                if (err) {
                	return done(err);
                }
            });

            return done(null, false, 'Token expired');
        }

        User.findById(token.userId, function(err: CallbackError, user: UserDocument) {

            if (err) {
            	return done(err);
            }

            if (!user || user.inactive) {
            	return done(null, false, 'Unknown user');
            }

            var info = { scope: '*' };
            return done(null, user, info);
        });
    });
}));

export default passport;
