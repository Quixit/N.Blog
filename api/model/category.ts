import mongoose, { Document, Schema } from 'mongoose';
import { Category } from '../../shared';

interface CategoryDocument extends Category, Document {}

const	Category = new Schema<CategoryDocument>({
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

export default mongoose.model<CategoryDocument>('Category', Category);
export { CategoryDocument, Category };
