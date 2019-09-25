qrusage
=======
[![Build Status](https://api.travis-ci.org/andrasq/node-qrusage.svg?branch=master)](https://travis-ci.org/andrasq/node-qrusage?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/andrasq/node-qrusage/badge.svg?branch=master)](https://coveralls.io/github/andrasq/node-qrusage?branch=master)


fast `getrusage()` binding to return process resource usage

binding to the unix `getrusage(2)` system call.  Returns the resource usage
metrics tracked by the operating system for the current process, or for its
completed child processes.  Low overhead, runs over 3 million calls /
second (node v8.9.4).


## Summary

    var getrusage = require('qrusage');
    var children_usage = getrusage(getrusage.RUSAGE_CHILDREN);
    var my_usage = getrusage();
    // => { utime: 0.031567, stime: 0.003945, maxrss: 25836, idrss: 0, ixrss: 0, isrss: 0,
    //      minflt: 2011, majflt: 0, nswap: 0, inblock: 0, oublock: 0, msgsnd: 0,
    //      msgrcv: 0, nsignals: 0, nvcsw: 12, nivcsw: 0 }


## Benchmark

    qtimeit=0.21.0 node=8.9.4 v8=6.1.534.50 platform=linux kernel=4.14.0-rc5-amd64 up_threshold=false
    arch=ia32 mhz=4512 cpuCount=8 cpu="Intel(R) Core(TM) i7-6700K CPU @ 4.00GHz"
    name                  speed         (stats)                                                         rate
    getrusage           201,548 ops/sec (2 runs of 94.3k calls in 0.936 out of 0.974 sec, +/- 0.43%)     202 >
    q.getrusage       3,218,110 ops/sec (2 runs of 1.59m calls in 0.991 out of 1.050 sec, +/- 0.19%)    3218 >>>>>>>>>>>>>>>>


## Functions

### getrusage( [who] )

return usage for the current process.  If called as
`getrusage(getrusage.RUSAGE_CHILDREN)` will return usage for all the
waited-for child processes of this process.


### Extras

#### getrusage.cputime( [who] )

returns the number of seconds of user + system cpu time used.  Accepts
the `getrusage.RUSAGE`_SELF or `getrusage.RUSAGE_CHILDREN` argument.

For historical reasons, this call is also available as `getrusage_cpu`.

#### getrusage.gettimeofday( ), getrusage.fptime( )

returns a floating-point microsecond precision timestamp.  Same speed as
but higher precision than Date.now(); much faster than process.hrtime().
Unlike the Unix system call, this one returns a floating point value and
not a `struct timeval`.

Also available as `fptime()`, being a floating-point version of the
`time()` system call.

#### getrusage.microtime( )

returns an integer microsecond precision timestamp.  This is the same
timestamp value as `gettimeofday` above, but without any decimal
rounding issues.

#### getrusage.cpuUsage( [lastUsage] )

return an object with properties `user` and `system` contain the number of
microseconds of cpu time that this process has used since starting, or,
if the optional `lastUsage` object is passed in, since that last usage
was read.

This call is the same as `process.cpuUsage()` that appeared in node-v6.1.0.


### Analytics

A few functions help with analytics gathering.

#### getrusage.storeUsage( name [,usage] )

Remember the provided usage (else the current usage) and associate it with `name`.  This
usage may be referred to by name later in calls to `deltaUsage` and `sumUsage`.

#### getrusage.removeUsage( name )

Remove and return from the store the usage associated with `name`.  This call deletes the
named usage from the store, and is intended to help with cleanup.

#### getrusage.deltaUsage( oldUsage [,newUsage] )

return an rusage object with the increases in usage from `oldUsage` to `newUsage`.  Without
`newUsage` it compares to the current usage.  The usage may be specified by name if already
defined with `storeUsage`.

`deltaUsage` diffs all fields, so the usage may be annotated with other metrics.
Fields that are present in only one usage object are retained unmodified.  Subtracted
fields must be numeric.

#### getrusage.sumUsage( usage1, usage2, ... )

return an rusage object with the usage totals from the given rusage objects.  Useful
to quickly get parent + child usage, or to total up deltas.  The usage may be
specified by name if defined with `storeUsage`.

`sumUsage` retains existing properties and property order, and can be used to copy
objects (sum a single usage) or to sum up annotated metrics fields.  Properties that
are present in only one object are retained unmodified.  Summed fields must be
numeric.

## Notes

Unlike the unix system call, qrusage returns floating-point utime and stime
instead of `struct timeval` timeval objects, and qrusage drops the `ru_`
prefix from the field names.

The list of getrusage fields (from linux man-pages-3.44 `getrusage(2)`):

    struct timeval ru_utime; /* user CPU time used */
    struct timeval ru_stime; /* system CPU time used */
    long   ru_maxrss;        /* maximum resident set size */
    long   ru_ixrss;         /* integral shared memory size */
    long   ru_idrss;         /* integral unshared data size */
    long   ru_isrss;         /* integral unshared stack size */
    long   ru_minflt;        /* page reclaims (soft page faults) */
    long   ru_majflt;        /* page faults (hard page faults) */
    long   ru_nswap;         /* swaps */
    long   ru_inblock;       /* block input operations */
    long   ru_oublock;       /* block output operations */
    long   ru_msgsnd;        /* IPC messages sent */
    long   ru_msgrcv;        /* IPC messages received */
    long   ru_nsignals;      /* signals received */
    long   ru_nvcsw;         /* voluntary context switches */
    long   ru_nivcsw;        /* involuntary context switches */


Linux does not maintain many of these fields, and currently returns zeroes for:

    ru_ixrss
    ru_idrss
    ru_isrss
    ru_nswap
    ru_msgsnd
    ru_msgrcv
    ru_nsignals


`qrusage` returns

    var getrusage = require('qrusage');
    var usage = getrusage();
    // =>
    // { utime: 0.031567,
    //   stime: 0.003945,
    //   maxrss: 25836,
    //   idrss: 0,
    //   ixrss: 0,
    //   isrss: 0,
    //   minflt: 2011,
    //   majflt: 0,
    //   nswap: 0,
    //   inblock: 0,
    //   oublock: 0,
    //   msgsnd: 0,
    //   msgrcv: 0,
    //   nsignals: 0,
    //   nvcsw: 12,
    //   nivcsw: 0 }


## Related Work

- [`getrusage`](http://npmjs.org/package/getrusage) - getrusage.usage, 200k/s
- [`qrusage`](http://npmjs.org/package/qrusage) - qrusage.getrusage, 3200k/s


## Change Log

- 1.5.1  change to build under node-v12
- 1.5.0  new calls `storeUsage`, `removeUsage`, `deltaUsage`, `sumUsage`
- 1.4.2  upgrade nan for node-v10, fix _float16 check, add to ci
- 1.4.1  100% test coverage, readme edits
- 1.4.0  3x speedup to `getrusage` and `cpuUsage` with node v4 and higher
- 1.3.0  cpuUsage() call
- 1.2.0  use `nan` 2.x for v8 bindings (5% slower though)
- 1.1.0  cputime() alias of getrusage_cpu(), microtime()
