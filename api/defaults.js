var nconf = require('nconf');

nconf.argv()
	.env()
	.file({
		file: './defaults.json'
	});

module.exports = nconf;
