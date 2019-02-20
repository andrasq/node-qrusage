/**
 * Copyright (C) 2014-2019 Andras Radics
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
    },

    'analytics': {

        'storeUsage should store current usage': function(t) {
            getrusage.storeUsage('test');
            var rusage = getrusage.removeUsage('test');
            t.ok(rusage.utime >= 0);
            t.ok(rusage.maxrss >= 0);
            t.done();
        },

        'storeUsage should store a given usage': function(t) {
            var usage = {};
            getrusage.storeUsage('test', usage);
            t.equal(getrusage.removeUsage('test'), usage);
            t.done();
        },

        'removeUsage should delete from the store': function(t) {
            getrusage.storeUsage('test');
            getrusage.removeUsage('test');
            t.strictEqual(getrusage.removeUsage('test'), undefined);
            t.done();
        },

        'sumUsage should return total usage': function(t) {
            var usage1 = { utime: 1, nvcsw: 7 }, usage2 = { utime: 2, nvcsw: 8 }, usage3 = { utime: 3, nvcsw: 9 };
            t.deepEqual(getrusage.sumUsage(usage1), { utime: 1, nvcsw: 7 });
            t.deepEqual(getrusage.sumUsage(usage1, usage2), { utime: 3, nvcsw: 15 });
            t.deepEqual(getrusage.sumUsage(usage1, usage2, usage3), { utime: 6, nvcsw: 24 });
            t.done();
        },

        'sumUsage should sum stored usage by name': function(t) {
            var usage1 = { utime: 1, nvcsw: 7 }, usage2 = { utime: 2, nvcsw: 8 }, usage3 = { utime: 3, nvcsw: 9 };
            getrusage.storeUsage('usage1', usage1);
            getrusage.storeUsage('usage2', usage2);
            getrusage.storeUsage('usage3', usage3);
            
            t.deepEqual(getrusage.sumUsage('usage1'), { utime: 1, nvcsw: 7 });
            t.deepEqual(getrusage.sumUsage('usage1', 'usage2'), { utime: 3, nvcsw: 15 });
            t.deepEqual(getrusage.sumUsage('usage1', 'usage2', 'usage3'), { utime: 6, nvcsw: 24 });
            t.done();
        },

        'sumUsage should copy and sum fields and retains field order': function(t) {
            var obj1 = { a: 1, b: 2 }, obj2 = { c: 3 }, obj3 = { c: 4 };

            t.deepEqual(getrusage.sumUsage(obj1), { a: 1, b: 2 });
            t.deepEqual(getrusage.sumUsage(obj1, obj2), { a: 1, b: 2, c: 3 });
            t.deepEqual(getrusage.sumUsage(obj1, obj2, obj3), { a: 1, b: 2, c: 7 });

            t.deepEqual(getrusage.sumUsage({ x: 0 }, obj1), { x: 0, a: 1, b: 2 });
            t.deepEqual(Object.keys(getrusage.sumUsage({ x: 0 }, obj1)), [ 'x', 'a', 'b' ]);

            t.done();
        },

        'sumUsage should throw if named usage not found': function(t) {
            t.throws(function() { getrusage.sumUsage('notfound') }, /not stored/);
            t.done();
        },

        'deltaUsage should return usage difference': function(t) {
            var usage1 = { utime: 1, nvcsw: 7, extra: 7 }, usage2 = { utime: 2, nvcsw: 8, extra: 9 };
            t.deepEqual(getrusage.deltaUsage(usage1, usage2), { utime: 1, nvcsw: 1, extra: 2 })
            t.done();
        },

        'deltaUsage should throw if named usage not found': function(t) {
            t.throws(function() { getrusage.deltaUsage('notfound') }, /notfound/);
            t.throws(function() { getrusage.deltaUsage('notfound') }, /usage not stored/);
            t.done();
        },

        'deltaUsage should use default currentUsage': function(t) {
            var usage1 = getrusage();
            var x = 0;
            // burn some cpu
            for (var i = 0; i < 20000000; i++) x += i; t.ok(x > 0);
            var usage2 = getrusage.deltaUsage(usage1);
            t.ok(usage2.utime > 0);
            t.done();
        },

        'deltaUsage should diff stored usage by name': function(t) {
            var usage1 = { utime: 1, nvcsw: 7, extra: 7 }, usage2 = { utime: 2, nvcsw: 8, extra: 9 };
            getrusage.storeUsage('usage1', usage1);
            getrusage.storeUsage('usage2', usage2);
            
            t.deepEqual(getrusage.deltaUsage('usage1', 'usage2'), { utime: 1, nvcsw: 1, extra: 2 })
            t.done();
        },

        'deltaUsage should diff all properties': function(t) {
            var obj1 = { a: 1, b: 2 }, obj2 = { b: 3, c: 4 };
            t.contains(getrusage.deltaUsage(obj1), { a: 1, b: 2 });
            t.deepEqual(getrusage.deltaUsage(obj1, obj2), { a: 1, b: 1, c: 4 });
            t.done();
        },
    },
};
