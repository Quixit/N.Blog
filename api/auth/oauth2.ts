import oauth2orize from 'oauth2orize';
import passport from 'passport';
import crypto from 'crypto';

import config from  '../config';
import getLogger from  '../log';

import User, { UserDocument } from '../model/user';
import AccessTokenModel from '../model/accessToken';
import RefreshTokenModel from '../model/refreshToken';
import { AccessToken, RefreshToken } from '../../shared'
import { CallbackError } from 'mongoose';

// create OAuth 2.0 server
var authServer = oauth2orize.createServer();

const log = getLogger(module);

// Generic error handler
var errFn = function (cb: (err: CallbackError) => void, err: CallbackError) {
	if (err) {
		return cb(err);
	}
};

// Destroys any old tokens and generates a new access and refresh token
var generateTokens = function (refresh: RefreshToken, access: AccessToken, done: oauth2orize.ExchangeDoneFunction) {

	// curries in `done` callback so we don't need to pass it
    const errorHandler = errFn.bind(undefined, done);

    RefreshTokenModel.deleteOne(refresh, errorHandler);
    AccessTokenModel.deleteOne(access, errorHandler);

    const tokenValue = crypto.randomBytes(32).toString('hex');
    const refreshTokenValue = crypto.randomBytes(32).toString('hex');
		const salt = crypto.randomBytes(32).toString('hex');
		const refreshSalt = crypto.randomBytes(32).toString('hex');

		let hash = crypto.createHmac('sha256', salt)
							 .update(tokenValue)
							 .digest('hex');

    access.token = hash;
		access.salt = salt;
    const token = new AccessTokenModel(access);

		let refreshHash = crypto.createHmac('sha256', refreshSalt)
							 .update(refreshTokenValue)
							 .digest('hex');

    refresh.token = refreshHash;
		refresh.salt = refreshSalt;
    const refreshToken = new RefreshTokenModel(refresh);

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
authServer.exchange(oauth2orize.exchange.password(function(client, username, password, _scope, done) {

	User.findOne({ username: username }, function(err: CallbackError, user: UserDocument) {

		if (err) {
			return done(err);
		}

		if (!user || !user.checkPassword(password)) {
			return done(null, false);
		}

		generateTokens({
			_id: null,
			userId: user._id,
			clientId: client._id,
			token: "",
			salt: "",
			created: new Date()
		}, {
			_id: null,
			userId: user._id,
			clientId: client._id,
			token: "",
			salt: "",
			created: new Date()
		}, done);
	});

}));

// Exchange RefreshTokenModel for access token.
authServer.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, _scope, done) {

	let key = '';
	let salt = '';

	if (refreshToken.length >= 64)
		salt = refreshToken.substring(0,64);

	if (refreshToken.length > 64)
		key = refreshToken.substring(64);

	const hash = crypto.createHmac('sha256', salt)
						 .update(key)
						 .digest('hex');

	RefreshTokenModel.findOne({ token: hash, clientId: client._id }, function(err: Error, token: RefreshToken) {
		if (err) {
			return done(err);
		}

		if (!token) {
			return done(null, false);
		}

		User.findById(token.userId, (err: CallbackError, user: UserDocument) => {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }

			generateTokens({
				_id: null,
				userId: user._id,
				clientId: client._id,
				token: "",
				salt: "",
				created: new Date()
			}, {
				_id: null,
				userId: user._id,
				clientId: client._id,
				token: "",
				salt: "",
				created: new Date()
			}, done);
		});
	});
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

const Token = [
	passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
	authServer.token(),
	authServer.errorHandler()
];

export { Token };
