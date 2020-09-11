import winston from  'winston';
import fs from 'fs';

function getLogger(_module: NodeModule) {

    fs.closeSync(fs.openSync('./all.log', 'a'));

    return winston.createLogger({
        transports : [
            new winston.transports.File({
                level: 'info',
                filename: './all.log',
                handleExceptions: true,
                //json: true,
                maxsize: 5242880, //5mb
                maxFiles: 2,
                //colorize: false
            }),
            new winston.transports.Console({
                level: 'debug',
                //label: getFilePath(_module),
                handleExceptions: true,
                //json: false,
                //colorize: true
            })
        ],
        exitOnError: false
    });
}

// function getFilePath (module: NodeModule) {
//     //using filename in log statements
//     return module.filename.split('/').slice(-2).join('/');
// }

export default getLogger;
