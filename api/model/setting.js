var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	Setting = new Schema({
		name: {
			type: String,
			unique: true,
			required: true
		},
		value: {
			type: String
		}
	});

module.exports = mongoose.model('Setting', Setting);
