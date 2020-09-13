import mongoose, { Document, Schema } from 'mongoose';
import { AccessToken } from '../../shared';

interface AccessTokenDocument extends AccessToken, Document {}

const AccessTokenSchema = new Schema<AccessTokenDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true
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
        default: Date.now
    }
});

export default mongoose.model<AccessTokenDocument>('AccessToken', AccessTokenSchema);
export { AccessTokenDocument, AccessToken };
