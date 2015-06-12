'use strict';
var path = require('path'),
    configmgr = require('./lib/configManager'),
    nginx = require('./lib/nginx'),
    log4js = require('log4js');

var logger = log4js.getLogger('NGINX');
logger.setLevel(process.env.LOG_LEVEL || 'INFO');


// Logs to both logger and file <prefix>/logs/error.log.
// Detailed output to error.log requires an nginx recompile, see http://nginx.org/en/docs/debugging_log.html).

module.exports = function (sourceConfig, configTransforms) {
    var tmpDir = path.resolve(configTransforms.tmpDir || '/tmp/nginx_test_temp_dir'),
        config;

    if (configTransforms) {
        config = configmgr.createTempConfig(sourceConfig, tmpDir, configTransforms, log);
    } else {
        config = sourceConfig;
    }

    logger.debug('Starting test server with log level %s and running in %s', logger.level.levelStr, tmpDir);

    return nginx({
        config: config,
        prefix: tmpDir,
        globals: ['error_log logs/error.log debug;'],
        log: log
    });
};

function log(data) {
    logger.debug.apply(logger, arguments);
}