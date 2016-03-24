'use strict';

var spawn = require('child_process').spawn,
  path = require('path');

function argument(options) {
  var args = [];

  if (options.config) {
    args.push('-c');
    args.push(path.resolve(options.config));
  }

  if (options.prefix) {
    args.push('-p');
    args.push(path.resolve(options.prefix));
  }

  args.push('-g');
  args.push(globals(options));

  return args;
}

function globals(options) {
  var level = process.env.LOG_LEVEL === 'TRACE' ? 'debug' : 'notice';
  var globals = options.globals || [];

  return globals
    .concat('error_log stderr ' + level + ';')
    .map(ensureSemicolon)
    .join(' ');
}

function ensureSemicolon(str) {
  return str.match(/;$/) ? str : str + ';';
}

/**
 *
 * @param {object} options
 * @param {string} options.config - Path to nginx config file. Required.
 * @param {string} options.prefix - Set nginx path prefix, i.e. a directory that will keep server files.
 * @param {[string]} options.globals - String array of global configuration directives.
 * @param {string} options.command - Nginx executable (default: 'nginx').
 * @param {function} options.log - Pass in function for logging nginx output.
 *
 */
module.exports = function (options) {
  var command = options.command || 'nginx';
  var log = options.log || function () {};
  var args = argument(options);
  var nginx;

  if (options && !options.config) {
    throw new Error('options.config is required');
  }

  function start(callback, env) {
    var started;
    log('Starting: ' + command + ' ' + args.join(' '));

    nginx = spawn(command, args, { env: env });
    nginx.stdout.on('data', log_nginx_buf);
    nginx.stderr.on('data', log_nginx_buf);

    nginx.stderr.on('data', function (buf) {
      if (!started && buf.toString().match(/start worker process \d+/)) {
        started = true;
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
        line.match(/\[debug\]/) ? console.log('d:', line) : log(line);
      }
    });
  }

  return {
    start: start,
    stop: stop
  };
};
