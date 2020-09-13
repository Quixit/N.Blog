import mongoose, { Document, Schema } from 'mongoose';
import { Page } from '../../shared';

interface PageDocument extends Page, Document {}

const Page = new Schema<PageDocument>({
	title: {
		type: String,
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
	slug: {
		type: String,
		unique: true,
		required: true
	},
	parent: {
      type: Schema.Types.ObjectId,
      ref: 'parent'
  }
});

export default mongoose.model<PageDocument>('Page', Page);
export { PageDocument, Page };
