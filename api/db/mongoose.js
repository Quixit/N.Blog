var mongoose = require('mongoose');

var log = require('../log')(module);
var config = require('../config');
var connectUri = config.get('mongoose:uri');

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect(connectUri, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.on('error', function (err) {
	log.error('Connection error:' + err.message);
});

db.once('open', function callback () {
	log.info("Connected to " + connectUri);
});

module.exports = mongoose;
