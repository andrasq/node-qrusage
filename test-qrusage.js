/**
 * Copyright (C) 2014,2016 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

getrusage = require('./');

module.exports = {
    'should have valid package.json': function(t) {
        var json = require('./package.json');
        t.done();
    },

    'should export getrusage': function(t) {
        t.equal(typeof getrusage, 'function');
        t.done();
    },

    'should export RUSAGE_* constants': function(t) {
        t.equal(typeof getrusage.RUSAGE_SELF, 'number');
        t.equal(typeof getrusage.RUSAGE_CHILDREN, 'number');
        t.equal(typeof getrusage.RUSAGE_THREAD, 'number');
        t.done();
    },

    'should return rusage object': function(t) {
        var usage = getrusage();
        t.equal(typeof usage, 'object');
        t.done();
    },

    'should return numeric usage values': function(t) {
        var usage = getrusage();
        var i;
        for (i in usage) t.equal(typeof usage[i], 'number');
        t.done();
    },

    'should return usage for RUSAGE_SELF': function(t) {
        var usage = getrusage(getrusage.RUSAGE_SELF);
        t.ok(usage);
        t.ok(usage.utime > 0);
        t.done();
    },

    'should return usage for RUSAGE_CHILDREN': function(t) {
        var usage = getrusage(getrusage.RUSAGE_CHILDREN);
        t.ok(usage);
        t.ok(usage.utime === 0.0);
        t.ok(usage.maxrss === 0);
        t.done();
    },

    'should return usage for RUSAGE_THREAD': function(t) {
        var usage = getrusage(getrusage.RUSAGE_THREAD);
        t.ok(usage);
        t.done();
    },

    'should not leak memory': function(t) {
        if (0) {
            var i, j;
            console.log(process.memoryUsage());
            for (i=0; i<200; i++) {
                for (j=0; j<200000; j++) getrusage();
                console.log(process.memoryUsage());
            }
        }
        t.done();
    },

    'cputime should return cpu usage': function(t) {
        t.ok(getrusage.cputime() > 0);
        t.done();
    },

    'getrusage_cpu should be an alias of cputime': function(t) {
        t.equal(getrusage.getrusage_cpu, getrusage.cputime);
        t.done();
    },

    'fptime should return the current time': function(t) {
        var t1 = getrusage.fptime();
        var t2 = Date.now();
        t.ok(Math.abs(t1 - t2/1000) < .01);
        t.done();
    },

    'gettimeofday should alias fptime': function(t) {
        t.equal(getrusage.fptime, getrusage.gettimeofday);
        t.done();
    },

    'microtime should return the current time': function(t) {
        var t1 = getrusage.microtime();
        var t2 = getrusage.fptime();
        t.ok(Math.abs(t1*1e-6 - t2) < .0001);
        t.done();
    },

    'cpuUsage should return usage': function(t) {
        var t1 = getrusage.cpuUsage();
        t.ok(t1.user > 0);
        t.ok(t1.system >= 0);
        t.done();
    },

    'cpuUsage should diff times': function(t) {
        var t1 = getrusage.cpuUsage({user: -10, system: -20});
        t.ok(t1.user > 10);
        t.ok(t1.system >= 20);
        t.done();
    },

    'node without Float64Array': {
        setUp: function(done) {
            delete process.version;
            process.version = '0.10.29';
            delete require.cache[require.resolve('./')];
            getrusage = require('./');
            done();
        },

        'microtime returns a number': function(t) {
            t.ok(getrusage.microtime() > 0);
            t.ok(getrusage.fptime() > 0);
            t.done();
        },

        'cpuUsage returns numbers': function(t) {
            t.ok(getrusage.cpuUsage().user > 0);
            t.ok(getrusage.cpuUsage().system >= 0);
            t.done();
        },

        'getrusage returns numbers': function(t) {
            var usage = getrusage.getrusage();
            t.ok(usage.utime > 0);
            t.ok(usage.maxrss > 0);
            t.done();
        },
    }
};
