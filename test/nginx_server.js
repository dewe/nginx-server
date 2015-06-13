/* global require, describe, it, before, after, beforeEach, afterEach */
'use strict';

var path = require('path'),
    assert = require('chai').assert,
    async = require('async'),
    fse = require('fs-extra');

var nginx = require('..');

describe('Nginx test server', function () {
    var tempDir = 'tmp';
    var options = {
        config: path.resolve('test/stubs/nginx.conf'),
        prefix: path.resolve(tempDir),
        pid: path.resolve(tempDir + '/nginx.pid')
        //, log: console.log
    };
    var server = nginx(options);

    fse.ensureDirSync(tempDir);
    fse.ensureFileSync(path.join(tempDir, 'logs/error.log'));

    console.log(options);

    it('requires option.config', function () {
        assert.throws(function () {
                nginx({})
            },
            /options.config/);
    });

    it('start', function (done) {
        startAndCheck(done);
    });

    it('stop', function (done) {
        stopAndCheck(done);
    });

    it('multiple start-stop', function (done) {

        async.series([
            startAndCheck,
            stopAndCheck,
            startAndCheck,
            stopAndCheck,
            startAndCheck,
            stopAndCheck,
            startAndCheck,
            stopAndCheck
        ], done);
    });

    function startAndCheck(callback) {
        server.start(function () {
            assert.isTrue(fse.existsSync(options.pid));
            callback();
        });
    }

    function stopAndCheck(callback) {
        server.stop(function () {
            assert.isFalse(fse.existsSync(options.pid));
            callback();
        });
    }
});
