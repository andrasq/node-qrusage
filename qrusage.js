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
module.exports.getrusage_array = binding.getrusage_array;
module.exports.getrusage_csv = binding.getrusage_csv;
module.exports.RUSAGE_SELF = binding.RUSAGE_SELF;
module.exports.RUSAGE_CHILDREN = binding.RUSAGE_CHILDREN;
module.exports.RUSAGE_THREAD = binding.RUSAGE_THREAD;

// extras
module.exports.getrusage_cpu = binding.getrusage_cpu;
module.exports.gettimeofday = binding.gettimeofday;
module.exports.fptime = binding.gettimeofday;

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

function getrusage_csv(which) {
    var fields = binding.getrusage_csv(which).split(",");
    return {
        utime: parseFloat(fields[0]),
        stime: parseFloat(fields[1]),
        maxrss: parseInt(fields[2], 10),
        idrss: parseInt(fields[3], 10),
        ixrss: parseInt(fields[4], 10),
        isrss: parseInt(fields[5], 10),
        minflt: parseInt(fields[6], 10),
        majflt: parseInt(fields[7], 10),
        nswap: parseInt(fields[8], 10),
        inblock: parseInt(fields[9], 10),
        oublock: parseInt(fields[10], 10),
        msgsnd: parseInt(fields[11], 10),
        msgrcv: parseInt(fields[12], 10),
        nsignals: parseInt(fields[13], 10),
        nvcsw: parseInt(fields[14], 10),
        nivcsw: parseInt(fields[15], 10)
    };
}
