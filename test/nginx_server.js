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
    var server = nginx({
        config: 'test/stubs/nginx.conf',
        prefix: prefixDir
    });

    it('requires option.config', function () {
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
});
