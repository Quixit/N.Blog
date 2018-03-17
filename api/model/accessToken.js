var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// AccessToken
var AccessToken = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports  = mongoose.model('AccessToken', AccessToken);
