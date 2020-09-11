var nconf = require('nconf');

nconf.argv()
	.env()
	.file({
		file: './defaults.json'
	});

export default nconf;
