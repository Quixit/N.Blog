var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	Category = new Schema({
		name: {
			type: String,
			unique: true,
			required: true
		},
		description: {
			type: String,
			required: false
		}
	});

module.exports = mongoose.model('Category', Category);
