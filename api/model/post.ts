import mongoose, { Document, Schema } from 'mongoose';
import { UserDocument } from './user';
import { CategoryDocument } from './category';

interface Post {
	id?: any;
	title: string;
	description?: string;
	content?: string;
	userId?:  UserDocument["_id"];
	categoryId?: CategoryDocument["_id"];
	tags: string[];
	published: boolean;
	slug: string;
	created: Date;
	modified: Date;
}

interface PostDocument extends Post, Document {}

const Post = new Schema<PostDocument>({
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
		type: Boolean,
		required: true
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

export default mongoose.model<PostDocument>('Post', Post);
export { PostDocument, Post };
