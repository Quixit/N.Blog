var log = require('./log')(module);
var db = require('./db/mongoose');
var defaults = require('./defaults');
const util = require('util');

var User = require('./model/user');
var Client = require('./model/client');
var AccessToken = require('./model/accessToken');
var RefreshToken = require('./model/refreshToken');

User.deleteMany({}, function(err) {
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

Client.deleteMany({}, function(err) {
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
