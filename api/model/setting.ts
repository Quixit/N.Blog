import mongoose, { Document, Schema } from 'mongoose';
import { Setting } from '../../shared';

interface SettingDocument extends Setting, Document {}

const Setting = new Schema<SettingDocument>({
	name: {
		type: String,
		unique: true,
		required: true
	},
	value: {
		type: String
	}
});

export default mongoose.model<SettingDocument>('Setting', Setting);
export { SettingDocument, Setting };
