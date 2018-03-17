var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    RefreshToken = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        clientId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Client'
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

module.exports = mongoose.model('RefreshToken', RefreshToken);
