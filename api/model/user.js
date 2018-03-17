var mongoose = require('mongoose'),
	crypto = require('crypto'),

	Schema = mongoose.Schema,

	User = new Schema({
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

User.methods.encryptPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha256').toString('hex');
};

User.virtual('userId')
.get(function () {
	return this.id;
});

User.virtual('password')
	.set(function(password) {
		this._plainPassword = password;
		this.salt = crypto.randomBytes(32).toString('hex');
		this.hashedPassword = this.encryptPassword(password);
  })
	.get(function() { return this._plainPassword; });


User.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', User);
