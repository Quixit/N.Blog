import mongoose, { Document, Schema } from 'mongoose';
import { UserDocument } from './user';
import { ClientDocument } from './client';

interface RefreshToken {
  id?: any;
  userId: UserDocument["_id"];
  clientId: ClientDocument["_id"];
	token: string;
	salt: string;
	created: Date;
}

interface RefreshTokenDocument extends RefreshToken, Document {}

const RefreshToken = new Schema<RefreshTokenDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    clientId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export default mongoose.model<RefreshTokenDocument>('RefreshToken', RefreshToken);
export { RefreshTokenDocument, RefreshToken };
