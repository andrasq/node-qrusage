var qtimeit = require('qtimeit');
var qrusage = require('./');

//var getrusage = require('getrusage');
//var microtime = require('microtime');

var x;
qtimeit.bench.timeGoal = 2;
qtimeit.bench({
/**
    'process.cpuUsage': function() {
        x = process.cpuUsage();
        // 2.3m/s
    },
    'Date.now': function() {
        x = Date.now();
        // 4.9m/s (was 6m/s with node-v0.10.42)
    },
    'cputime': function() {
        x = qrusage.cputime();
    },
    'q.cpuUsage': function() {
        x = qrusage.cpuUsage();
        // 920k/s returning an array
        // 2.5m/s poking values into Float64 array
    },
**/
    'q.getrusage': function() {
        x = qrusage.getrusage();
        // 200k/s returning a new obj (was 400k/s with node-v0.10.42)
        // 655k/s populating Float64 array
    },
    'q.microtime': function() {
        x = qrusage.microtime();
        // 4.8m/s
        // 5.2m/s poking value into Float64 array
    },
/**
    'microtime': function() {
        x = microtime.now();
        // 4.8m/s
        // x = microtime.nowDouble();
        // 4.5m/s
        // x = microtime.nowStruct();
        // 1.1m/s
    },
    'getrusage': function() {
        x = getrusage.usage();
        // 100k/s
    },
**/
});
