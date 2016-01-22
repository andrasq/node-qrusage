qrusage
=======

fast getrusage() binding to return process resource usage

binding to the unix getrusage(2) system call.  Returns the resource usage
metrics tracked by the operating system for the current process, or for its
completed child processes.  Very low overhead, runs over 400,000 calls /
second.


## Installation

        npm install qrusage
        npm test qrusage


## Summary

        var getrusage = require('qrusage');
        var RUSAGE_CHILDREN = getrusage.RUSAGE_CHILDREN;

        var rusage_self = getrusage();
        // =>
        // { utime: 0.016,
        //   stime: 0.008,
        //   maxrss: 9892,
        //   idrss: 0,
        //   ixrss: 0,
        //   isrss: 0,
        //   minflt: 840,
        //   majflt: 0,
        //   nswap: 0,
        //   inblock: 0,
        //   oublock: 0,
        //   msgsnd: 0,
        //   msgrcv: 0,
        //   nsignals: 0,
        //   nvcsw: 32,
        //   nivcsw: 4 }

        var rusage_children = getrusage(RUSAGE_CHILDREN);


## Functions

### getrusage( )

return usage for the current process.  If called as
`getrusage(getrusage.RUSAGE_CHILDREN)` will return usage for all the
waited-for child processes of this process.

### Extras

#### getrusage.cputime( )

returns the number of seconds of user + system cpu time used.  Accepts
the getrusage.RUSAGE_SELF or getrusage.RUSAGE_CHILDREN argument.

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

## Notes

Unlike the unix system call, qrusage returns floating-point utime and stime
instead of `struct timeval` timeval objects, and qrusage drops the `ru_`
prefix from the field names.

The list of getrusage fields (from linux man-pages-3.44 getrusage(2)):

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

## Change Log

1.2.0
- use `nan` 2.x for v8 bindings (15% slower though)

1.1.0
- cputime() alias of getrusage_cpu()
- microtime()
- remove test code from C++ sources
