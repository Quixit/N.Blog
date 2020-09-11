import mongoose from 'mongoose';

import getLogger from '../log';
import config from '../config';

const log = getLogger(module);
const connectUri = config.get('mongoose:uri');

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

export default mongoose;
