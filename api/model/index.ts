import mongoose, { Document, Schema } from 'mongoose';
import { PageDocument } from './page';

interface Index {
	id?: any;
	title: string;
	slug: string;
	pageId: PageDocument["_id"];
}

interface IndexDocument extends Index, Document {}

const Index = new Schema<IndexDocument>({
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

export default mongoose.model<IndexDocument>('Index', Index);
export { IndexDocument, Index };
