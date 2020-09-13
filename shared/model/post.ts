interface Post {
	_id: any;
	title: string;
	description?: string;
	content?: string;
	userId?:  any;
	categoryId?: any;
	tags: string[];
	published: boolean;
	slug: string;
	created: Date;
	modified: Date;
}

export { Post };
