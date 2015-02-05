/**
 * qrusage -- quick getrusage()
 *
 * Unix getrusage() binding.  Should work on any unix system, but the
 * fields not maintained by Linux are returned as zeros.  These are
 * ixrss, idrss, isrss, nswap, msgsnd, msgrcv, nsignals
 *
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */


'use strict';

var binding = require('./build/Release/qrusage');

module.exports = function(which) { return getrusage_array(which); }
module.exports.getrusage = getrusage_array;
module.exports.RUSAGE_SELF = binding.RUSAGE_SELF;
module.exports.RUSAGE_CHILDREN = binding.RUSAGE_CHILDREN;
module.exports.RUSAGE_THREAD = binding.RUSAGE_THREAD;

module.exports.cputime = binding.cputime;               // new 1.1.0 name
module.exports.getrusage_cpu = binding.cputime;         // pre-1.1.0 name

module.exports.gettimeofday = binding.gettimeofday;
module.exports.fptime = binding.gettimeofday;
module.exports.microtime = binding.microtime;

module.exports.binding = binding;


function getrusage_array(which) {
    var fields = binding.getrusage_array(which);
    return {
        utime: fields[0],
        stime: fields[1],
        maxrss: fields[2],
        idrss: fields[3],
        ixrss: fields[4],
        isrss: fields[5],
        minflt: fields[6],
        majflt: fields[7],
        nswap: fields[8],
        inblock: fields[9],
        oublock: fields[10],
        msgsnd: fields[11],
        msgrcv: fields[12],
        nsignals: fields[13],
        nvcsw: fields[14],
        nivcsw: fields[15]
    };
}
