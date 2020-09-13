import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';
import { User } from '../../shared';

interface UserDocument extends User, Document {}

const User = new Schema<UserDocument>({
	username: {
		type: String,
		unique: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
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
	inactive: {
		type: Boolean
	}
});

User.methods.encryptPassword = function(password: string) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha256').toString('hex');
};

User.virtual('userId')
.get(function (this: UserDocument) {
	return this.id;
});

User.virtual('password')
	.set(function(this: UserDocument, password: string) {
		this.salt = crypto.randomBytes(32).toString('hex');
		this.hashedPassword = this.encryptPassword(password);
  })
	.get(function(this: UserDocument) { return this._plainPassword; });


User.methods.checkPassword = function(password : string) {
	return this.encryptPassword(password) === this.hashedPassword;
};

export default mongoose.model<UserDocument>('User', User);
export { UserDocument, User };
