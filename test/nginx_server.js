/* global require, describe, it, before, after, beforeEach, afterEach */
'use strict';

var path = require('path'),
    assert = require('chai').assert,
    temp = require('temp').track(),
    async = require('async'),
    fse = require('fs-extra');

var nginx = require('..');

describe('Nginx test server', function () {
    var tempDir = 'tmp';//temp.mkdirSync('nginx_server_test');
    var options = {
        config: path.resolve('test/stubs/nginx.conf'),
        prefix: path.resolve(tempDir),
        log: console.log
    };
    var server = nginx(options);

    fse.ensureDirSync(tempDir);
    fse.ensureFileSync(path.join(tempDir, 'logs/error.log'));

    console.log(options);

    it('start', function (done) {
        server.start(done);
        // assert on pid file
    });

    it('stop', function (done) {
        server.stop(done);
        // assert on pid file
    });

    it('multiple start-stop', function (done) {

        async.series([
            server.start,
            server.stop,
            server.start,
            server.stop,
            server.start,
            server.stop
        ], done);
    });

});
