var winston = require('winston');
var fs = require('fs');

winston.emitErrs = true;

function logger(module) {

    fs.closeSync(fs.openSync('./all.log', 'a'));

    return new winston.Logger({
        transports : [
            new winston.transports.File({
                level: 'info',
                filename: './all.log',
                handleException: true,
                json: true,
                maxSize: 5242880, //5mb
                maxFiles: 2,
                colorize: false
            }),
            new winston.transports.Console({
                level: 'debug',
                label: getFilePath(module),
                handleException: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });
}

function getFilePath (module ) {
    //using filename in log statements
    return module.filename.split('/').slice(-2).join('/');
}

module.exports = logger;
