interface User{
	_id?: any;
	userId?: any;
	username: string;
	email: string;
	firstName?: string;
	lastName?: string;
	hashedPassword: string;
	password?: string;
	_plainPassword?: string;
	salt: string;
	created: Date;
	modified: Date;
	inactive: boolean;
	encryptPassword: (password: string) => string;
	checkPassword: (password: string) => boolean;
}

export { User };
