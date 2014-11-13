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
};
