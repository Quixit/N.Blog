import mongoose, { Document, Schema } from 'mongoose';
import { Client } from '../../shared';

interface ClientDocument extends Client, Document {}

const Client = new Schema<ClientDocument>({
	name: {
		type: String,
		unique: true,
		required: true
	},
	clientId: {
		type: String,
		unique: true,
		required: true
	},
	clientSecret: {
		type: String,
		required: true
	}
});

export default mongoose.model<ClientDocument>('Client', Client);
export { ClientDocument, Client };
