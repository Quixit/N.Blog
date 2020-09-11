import getLogger from './log';
import db from './db/mongoose';
import defaults from './defaults';
import util from 'util';

import User from './model/user';
import Client from './model/client';
import AccessToken from './model/accessToken';
import RefreshToken from './model/refreshToken';

const log = getLogger(module);

User.deleteMany({}, function(_err) {
    var user = new User({
        username: defaults.get("default:user:username"),
        password: defaults.get("default:user:password"),
        email: defaults.get("default:user:email")
    });

    user.save(function(err, user) {
        if(!err) {
            log.info(util.format("Add User - %s:%s", user.username, user.password));
        } else {
            return log.error(err);
        }
    });
});

Client.deleteMany({}, function(_err) {
    var client = new Client({
        name: defaults.get("default:client:name"),
        clientId: defaults.get("default:client:clientId"),
        clientSecret: defaults.get("default:client:clientSecret")
    });

    client.save(function(err, client) {

        if(!err) {
            log.info(util.format("Add Client - %s:%s", client.clientId, client.clientSecret));
        } else {
            return log.error(err);
        }

    });
});

AccessToken.deleteMany({}, function (err) {
    if (err) {
        return log.error(err);
    }
});

RefreshToken.deleteMany({}, function (err) {
    if (err) {
        return log.error(err);
    }
});

setTimeout(function() {
    db.disconnect();
}, 3000);
