import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from './auth/passport';
import methodOverride from 'method-override';
import getLogger from './log';
import router from './routes/router';
import util from 'util';

const log = getLogger(module);

//Configure express.
var app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(passport.initialize());

app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res){
    res.status(404);
    log.debug(util.format('%s %d %s', req.method, res.statusCode, req.url));
    res.json({
    	error: 'Not found'
    });
    return;
});

// error handlers
app.use(function(err: any, req: any, res: any, _next: any){
    res.status(err.status || 500);
    log.debug(util.format('%s %d %s', req.method, res.statusCode, err.message));
    res.json({
    	error: err.message
    });
    return;
});

export default app;
