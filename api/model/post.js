var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	Post = new Schema({
		title: {
			type: String,
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
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: 'Category'
		},
		tags: [{
			type: String
		}],
		published: {
			type: Boolean
		},
		slug: {
			type: String,
			unique: true
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
		}
	});

module.exports = mongoose.model('Post', Post);
