#!/usr/bin/env node
import debug from 'debug';

import app from '../app';
import config from '../config';
import getLogger from '../log';

const log = getLogger(module);

app.set('port', process.env.PORT || config.get('port') || 8080);

app.listen(app.get('port'), function() {
  debug('restapi')('Express server listening on port ' + app.get('port'));
  log.info('Express server listening on port ' + app.get('port'));
});
