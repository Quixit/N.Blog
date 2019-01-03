var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');

var config = require('../config');
var log = require('../log')(module);

var db = require('../db/mongoose');
var User = require('../model/user');
var AccessToken = require('../model/accessToken');
var RefreshToken = require('../model/refreshToken');

// create OAuth 2.0 server
var authServer = oauth2orize.createServer();

// Generic error handler
var errFn = function (cb, err) {
	if (err) {
		return cb(err);
	}
};

// Destroys any old tokens and generates a new access and refresh token
var generateTokens = function (data, done) {

	// curries in `done` callback so we don't need to pass it
    var errorHandler = errFn.bind(undefined, done),
	    refreshToken,
	    refreshTokenValue,
	    token,
	    tokenValue,
			salt,
			refreshSalt;

    RefreshToken.deleteOne(data, errorHandler);
    AccessToken.deleteOne(data, errorHandler);

    tokenValue = crypto.randomBytes(32).toString('hex');
    refreshTokenValue = crypto.randomBytes(32).toString('hex');
		salt = crypto.randomBytes(32).toString('hex');
		refreshSalt = crypto.randomBytes(32).toString('hex');

		let hash = crypto.createHmac('sha256', salt)
							 .update(tokenValue)
							 .digest('hex');

    data.token = hash;
		data.salt = salt;
    token = new AccessToken(data);

		let refreshHash = crypto.createHmac('sha256', refreshSalt)
							 .update(refreshTokenValue)
							 .digest('hex');

    data.token = refreshHash;
		data.salt = refreshSalt;
    refreshToken = new RefreshToken(data);

    refreshToken.save(errorHandler);

    token.save(function (err) {
    	if (err) {

			log.error(err);
    		return done(err);
    	}
    	done(null, salt + tokenValue, refreshSalt + refreshTokenValue, {
    		'expires_in': config.get('security:tokenLife')
    	});
    });
};

// Exchange username & password for access token.
authServer.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {

	User.findOne({ username: username }, function(err, user) {

		if (err) {
			return done(err);
		}

		if (!user || !user.checkPassword(password)) {
			return done(null, false);
		}

		var model = {
			userId: user.userId,
			clientId: client._id
		};

		generateTokens(model, done);
	});

}));

// Exchange refreshToken for access token.
authServer.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {

	let key = '';
	let salt = '';

	if (refreshToken.length >= 64)
		salt = refreshToken.substring(0,64);

	if (refreshToken.length > 64)
		key = refreshToken.substring(64);

	const hash = crypto.createHmac('sha256', salt)
						 .update(key)
						 .digest('hex');

	RefreshToken.findOne({ token: hash, clientId: client._id }, function(err, token) {
		if (err) {
			return done(err);
		}

		if (!token) {
			return done(null, false);
		}

		User.findById(token.userId, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }

			var model = {
				userId: user.userId,
				clientId: client._id
			};

			generateTokens(model, done);
		});
	});
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
	passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
	authServer.token(),
	authServer.errorHandler()
];
