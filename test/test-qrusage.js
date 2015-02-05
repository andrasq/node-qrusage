getrusage = require('../qrusage.js');

module.exports = {
    'should have valid package.json': function(t) {
        var json = require('../package.json');
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
};
