/* global require, describe, it, before, after, beforeEach, afterEach */
'use strict';

var path = require('path'),
    assert = require('chai').assert,
    async = require('async'),
    fse = require('fs-extra');

var nginx = require('..');

describe('Nginx test server', function () {
    var options = {
        config: 'test/stubs/nginx.conf',
        prefix: 'tmp'
        //config: path.resolve('test/stubs/nginx.conf'),
        //prefix: path.resolve('tmp')
    };
    var server = nginx(options);

    // prep test
    fse.emptyDirSync(options.prefix);
    fse.ensureFileSync(path.join(options.prefix, 'logs/error.log'));

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
