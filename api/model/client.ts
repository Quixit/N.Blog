import mongoose, { Document, Schema } from 'mongoose';

interface Client {
	id?: any;
	name: string;
	clientId: string;
	clientSecret: string;
}

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
