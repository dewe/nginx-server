'use strict';

var spawn = require('child_process').spawn,
    path = require('path');

function argument(options) {
    var args = [];
    var globals = options.globals || [];

    if (options.config) {
        args.push('-c');
        args.push(path.resolve(options.config));
    }
    if (options.prefix) {
        args.push('-p');
        args.push(path.resolve(options.prefix));
    }
    globals = globals.concat('error_log stderr notice;');
    args.push('-g');
    args.push(globals.join(' '));
    return args;
}

/**
 *
 * @param {object} options
 * @param {string} options.config - Path to nginx config file. Required.
 *
 */
module.exports = function (options) {
    var command = options.command || 'nginx';  // openresty path: /usr/local/openresty/nginx/sbin
    var log = options.log || function () {};
    var args = argument(options);
    var nginx;

    if (options && !options.config) {
        throw new Error('options.config is required');
    }

    function start(callback, env) {
        log('Starting: ' + command + ' ' + args.join(' '));

        nginx = spawn(command, args, {env: env});
        nginx.stdout.on('data', log_nginx_buf);
        nginx.stderr.on('data', log_nginx_buf);

        nginx.stderr.on('data', function (buf) {
            if (buf.toString().match(/start worker process \d+/)) {
                log('Nginx worker process started.');
                callback();
            }
        });
    }

    function stop(callback) {
        log('Stopping.');

        nginx.on('close', function () {
            log('Nginx server closed.');
            if (callback) {
                callback();
            }
        });

        spawn(command, args.concat(['-s', 'stop']));
    }

    function log_nginx_buf(buf) {
        var lines = buf.toString().split('\n');
        lines.forEach(function (line) {
            if (line.length) {
                //line.match(/\[debug\]/) ? logger.trace(line) : logger.debug(line);
                log(line);
            }
        });
    }

    return {
        start: start,
        stop: stop
    };
};

