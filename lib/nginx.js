'use strict';

var spawn = require('child_process').spawn,
    path = require('path'),
    fs = require('fs');

/**
 *
 * @param {object} options
 * @param {string} options.config - Path to nginx config file. Required.
 *
 */
module.exports = function (options) {
    if (options && !options.config) {
        throw new Error('options.config is required');
    }

    var command = options.command || '/usr/local/openresty/nginx/sbin/nginx'; // openresty default
    var config = options.config;
    var prefix = options.prefix;
    var globals = options.globals || [];
    var pidfile = path.join(options.prefix, 'nginx.pid');
    var log = options.log || function () {};
    var nginx;

    function start(callback, env) {
        var c = command;
        var g = globals.slice(0);
        var args = [];
        var level = process.env.LOG_LEVEL == 'TRACE' ? 'debug' : 'notice';

        // generate args
        if (config) {
            args.push('-c');
            args.push(config);
        }
        if (prefix) {
            args.push('-p');
            args.push(prefix);
        }

        g.push('pid ' + pidfile + ';');
        g.push('error_log stderr notice;'); // use debug for detailed output.
        //if (logger && logger.level && logger.level.levelStr === 'TRACE') {
        //    g.push('error_log logs/error.log debug; error_log stderr debug;');
        //} else {
        //    g.push('error_log logs/error.log notice; error_log stderr notice;');
        //}
        args.push('-g');
        args.push(g.join(' '));

        // spawn process
        log('Spawn: ' + c + ' ' + args.join(' '));
        nginx = spawn(c, args, {env: env});
        nginx.stdout.on('data', log_nginx_buf);
        nginx.stderr.on('data', log_nginx_buf);

        // report when worker process started
        nginx.stderr.on('data', function (buf) {
            if (buf.toString().match(/start worker process \d+/)) {
                log('Nginx worker process started.');
                callback();
            }
        });
    }

    function stop(callback) {
        var pid = fs.readFileSync(pidfile, 'utf8');

        nginx.on('close', function () {
            log('Nginx server closed.');
            if (callback) {
                callback();
            }
        });

        process.kill(pid);
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


///**
// Start nginx server.
// @param {function} callback - callback function for when nginx has started, no args.
// @param {object} env (optional) - environment variables to be used.
// */
//Server.prototype.start = function (callback, env) {
//    var command = this.command;
//    var globals = this.globals.slice(0);
//    var args = [];
//
//    // generate args
//    if (this.config) {
//        args.push('-c');
//        args.push(this.config);
//    }
//    if (this.prefix) {
//        args.push('-p');
//        args.push(this.prefix);
//    }
//
//    if (this.pidfile) {
//        globals.push('pid ' + this.pidfile);
//    }
//    if (logger.level.levelStr === 'TRACE') {
//        globals.push('error_log logs/error.log debug; error_log stderr debug;');
//    } else {
//        globals.push('error_log logs/error.log notice; error_log stderr notice;');
//    }
//    args.push('-g');
//    args.push(globals.join(';'));
//
//    // spawn process
//    logger.info('Running: %s', command + ' ' + args.join(' '));
//    this.nginx = spawn(command, args, {env: env});
//    this.nginx.stdout.on('data', log_nginx_buf);
//    this.nginx.stderr.on('data', log_nginx_buf);
//
//    // report when worker process started
//    this.nginx.stderr.on('data', function (buf) {
//        if (buf.toString().match(/start worker process \d+/)) {
//            logger.info('worker process started.');
//            callback();
//        }
//    });
//};
//
//
///**
// * Stop nginx process and child processes, callback is executed
// * when process has closed completely.
// * @param callback
// */
//Server.prototype.stop = function (callback) {
//    var pid = fse.readFileSync(this.pidfile, 'utf8');
//
//    this.nginx.on('close', function () {
//        logger.info('nginx server closed.');
//        if (callback) {
//            callback();
//        }
//    });
//
//    process.kill(pid);
//    logger.info('closing nginx master process (%d)', pid);
//};
