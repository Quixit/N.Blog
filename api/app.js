const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('./auth/passport');
const methodOverride = require('method-override');
const log = require('./log')(module);
const router = require('./routes/router');
const util = require('util');

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
app.use(function(req, res, next){
    res.status(404);
    log.debug(util.format('%s %d %s', req.method, res.statusCode, req.url));
    res.json({
    	error: 'Not found'
    });
    return;
});

// error handlers
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.debug(util.format('%s %d %s', req.method, res.statusCode, err.message));
    res.json({
    	error: err.message
    });
    return;
});

module.exports = app;
