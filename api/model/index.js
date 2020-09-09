var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	Index = new Schema({
		title: {
			type: String,
			required: true
		},
		slug: {
			type: String,
			required: true,
			unique: true
		},
		pageId: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'Page'
		}
	});

module.exports = mongoose.model('Index', Index);
