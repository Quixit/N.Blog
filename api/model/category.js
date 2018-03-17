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
		},
		content: {
			type: String,
			required: false
		},
		parent: {
        type: Schema.Types.ObjectId,
        ref: 'parent',
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'child',
    }]
	});

module.exports = mongoose.model('Category', Category);
