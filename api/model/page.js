var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	Page = new Schema({
		title: {
			type: String,
			unique: true,
			required: true
		},
		description: {
			type: String
		},
		content: {
			type: String
		},
		created: {
			type: Date,
			required: true,
			default: Date.now
		},
		modified: {
			type: Date,
			required: true,
			default: Date.now
		},
		published: {
			type: Boolean,
			required: true
		},
		list: {
			type: Boolean,
			required: true
		},
		slug: {
			type: String,
			unique: true
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

module.exports = mongoose.model('Page', Page);
