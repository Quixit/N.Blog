interface Page {
	_id: any;
	title: string;
	description?: string;
	content?: string;
	created: Date;
	modified: Date;
	published: boolean;
	slug: string;
	parent: any;
}

interface PageItem {
		page: Page;
		children: PageItem[];
		expanded: boolean;
}

export { Page, PageItem };
