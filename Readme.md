qrusage
=======

quicker getrusage() binding to return process resource usage

Returns the resource usage metrics tracked by the system for the current
process or for its completed child processes.  Very low overhead, runs over
400,000 calls / second.


### Installation

        npm install qrusage

        npm test qrusage


### Summary

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


### Notes

Unlike the unix system call, qrusage returns floating-point utime and stime
instead of `struct timeval` timeval objects, and qrusage drops the `ru_`
prefix from the field names.

The list of getrusage fields (from linux man-pages 3.44 `man 2 getrusage`):

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

Linux does not maintain many of these fields, and currently returns zeroes:

        ru_ixrss
        ru_idrss
        ru_isrss
        ru_nswap
        ru_msgsnd
        ru_msgrcv
        ru_nsignals
