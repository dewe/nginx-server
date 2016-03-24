/* global require, describe, it, before, after, beforeEach, afterEach */
'use strict';

var path = require('path'),
  assert = require('chai').assert,
  async = require('async'),
  fse = require('fs-extra');

var nginx = require('..');

var prefixDir = 'tmp';
fse.emptyDirSync(prefixDir);
fse.ensureFileSync(path.join(prefixDir, 'logs/error.log'));


describe('Nginx test server', function () {
  this.slow(500);

  var server = nginx({
    config: 'test/conf/nginx.conf',
    prefix: prefixDir
      // , log: console.log
  });

  it('require option.config', function () {
    assert.throws(function () {
        nginx({})
      },
      /options.config/);
  });

  it('start', function (done) {
    server.start(done);
  });

  it('stop', function (done) {
    server.stop(done);
  });

  it('multiple start-stop', function (done) {

    async.series([
            server.start,
            server.stop,
            server.start,
            server.stop,
            server.start,
            server.stop,
            server.start,
            server.stop
        ], done);
  });

  it('start callback is called only once', function (done) {
    var called = 0;

    server.start(() => {
      server.stop(() => called++);
    });

    setTimeout(() => {
      assert.equal(called, 1);
      done();
    }, 100);
  });

});
