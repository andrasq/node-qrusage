// npm install getursage microtime

var qtimeit = require('qtimeit');
var qrusage = require('./');

try { var getrusage = require('getrusage'); } catch (e) { }
try { var microtime = require('microtime'); } catch (e) { }

var floats = new Float64Array(16);
var x;
qtimeit.bench.timeGoal = .5;
qtimeit.bench.visualize = true;
qtimeit.bench.baselineAvg = 1000000;
qtimeit.bench({
/**
    'getrusage': function() {
        x = getrusage.usage();
        // 100k/s
    },
    'q.getrusage': function() {
        x = qrusage.getrusage();
        // 200k/s returning a new obj (was 400k/s with node-v0.10.42)
        // 655k/s populating Float64 array (Phenom II 3.6g)
        // 1070k/s (Skylake 4.5g)
        // 1060k/s (Ryzen R2600X 4.0g)
    },
/**/

    'q.zero return': function() {
        x = qrusage.binding.zero();
        // 23.1m/s (SKL 4.5g)
    },
/**
    'q.zero poke': function() {
        qrusage.binding.zero(floats);
        x = floats[0];
        // 24.6m/s (SKL 4.5g)
    },
    'process.cpuUsage': function() {
        x = process.cpuUsage();
        // 2.3m/s
        // 3.7m/s SKL 4.5g node-v8
    },
    'Date.now': function() {
        x = Date.now();
        // 4.9m/s (was 6m/s with node-v0.10.42)
        // 7.3m/s (SKL 4.5g), 8.2m/s node-v8
    },
    'cputime': function() {
        x = qrusage.cputime();
        // 2.6m/s (SKL 4.5g)
    },
    'q.cpuUsage': function() {
        x = qrusage.cpuUsage();
        // 920k/s returning an array
        // 2.5m/s poking values into Float64 array
        // 2.7m/s (SKL 4.5g), 3.7m/s node-v8
    },
**/
    'q.getrusage': function() {
        x = qrusage.getrusage();
        // 200k/s returning a new obj (was 400k/s with node-v0.10.42)
        // 655k/s populating Float64 array (Phenom II 3.6g)
        // 1070k/s (Skylake 4.5g)
        // 3.4m/s SKL 4.5g node-v8
    },
    'q.microtime': function() {
        x = qrusage.microtime();
        // 4.8m/s
        // 5.2m/s poking value into Float64 array (Phenom II 3.6g)
        // 7.4m/s (SKL 4.5g), 7.8m/s node-v8
    },
/**
    'microtime': function() {
        x = microtime.now();
        // 4.8m/s
        // x = microtime.nowDouble();
        // 4.5m/s
        // 7.1m/s (SKL 4.5g), 7.5m/s node-v8
        // x = microtime.nowStruct();
        // 1.1m/s
    },
    'getrusage': function() {
        x = getrusage.usage();
        // 100k/s
        // 200k/s SKL 4.5g node-v8
        // 113k/s R2600X
    },
/**/
});

console.log(x, floats[0], floats[1]);
