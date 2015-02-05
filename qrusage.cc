/**
 * Copyright (C) 2014 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

#include <v8.h>
#include <node.h>

#include <sys/time.h>
#include <sys/resource.h>

#ifndef RUSAGE_THREAD
#  define RUSAGE_THREAD         RUSAGE_SELF
#endif

using namespace v8;


Handle<Value>
Cputime( const Arguments& args )
{
    HandleScope scope;
    struct rusage ru;
    int who = (args[0]->IsNumber()) ? args[0]->Int32Value() : RUSAGE_SELF;

    getrusage(who, &ru);
    double cpu =
        ru.ru_utime.tv_sec + ru.ru_utime.tv_usec * 1e-6 +
        ru.ru_stime.tv_sec + ru.ru_stime.tv_usec * 1e-6;

    return scope.Close(Number::New(cpu));
}

Handle<Value>
Gettimeofday( const Arguments& args )
{
    HandleScope scope;
    struct timeval tv;

    gettimeofday(&tv, NULL);

    double time = tv.tv_sec + tv.tv_usec * 1e-6;
    return scope.Close(Number::New(time));
}

Handle<Value>
Microtime( const Arguments& args )
{
    HandleScope scope;
    struct timeval tv;

    gettimeofday(&tv, NULL);

    double time = tv.tv_sec * 1e6 + tv.tv_usec;
    return scope.Close(Number::New(time));
}

// it is much faster to return a v8 array and unpack it in js (440k/s vs 220k/s)
// (php is 409k/s)
Handle<Value> GetrusageArray( const Arguments& args )
{
    // note: HandleScope adds 3% overhead to each of these calls
    HandleScope scope;
    struct rusage ru;
    int who = (args[0]->IsNumber()) ? args[0]->Int32Value() : RUSAGE_SELF;

    getrusage(who, &ru);

    // faster to zero-detect than to create new Number every time
    v8::Local<v8::Number> zero = Number::New(0);
    #define _number(v)     (((v) > 0) ? Number::New(v) : zero)

    Local<Object> info = Array::New(16);
    info->Set(0, Number::New((double)ru.ru_utime.tv_sec + (double)ru.ru_utime.tv_usec * 1e-6));
    info->Set(1, Number::New((double)ru.ru_stime.tv_sec + (double)ru.ru_stime.tv_usec * 1e-6));
    info->Set(2, Number::New(ru.ru_maxrss));
    info->Set(4, _number(ru.ru_ixrss));
    info->Set(3, _number(ru.ru_idrss));
    info->Set(5, _number(ru.ru_isrss));
    info->Set(6, Number::New(ru.ru_minflt));
    info->Set(7, _number(ru.ru_majflt));
    info->Set(8, _number(ru.ru_nswap));
    info->Set(9, _number(ru.ru_inblock));
    info->Set(10, _number(ru.ru_oublock));
    info->Set(11, _number(ru.ru_msgsnd));
    info->Set(12, _number(ru.ru_msgrcv));
    info->Set(13, _number(ru.ru_nsignals));
    info->Set(14, Number::New(ru.ru_nvcsw));
    info->Set(15, Number::New(ru.ru_nivcsw));

    return scope.Close(info);
}

extern "C" void init( Handle<Object> exports )
{
    exports->Set(String::New("cputime"), FunctionTemplate::New(Cputime)->GetFunction());
    exports->Set(String::New("gettimeofday"), FunctionTemplate::New(Gettimeofday)->GetFunction());
    exports->Set(String::New("microtime"), FunctionTemplate::New(Microtime)->GetFunction());

    exports->Set(String::New("getrusage_array"), FunctionTemplate::New(GetrusageArray)->GetFunction());

    exports->Set(String::New("RUSAGE_SELF"), Number::New(RUSAGE_SELF));
    exports->Set(String::New("RUSAGE_CHILDREN"), Number::New(RUSAGE_CHILDREN));
    exports->Set(String::New("RUSAGE_THREAD"), Number::New(RUSAGE_THREAD));
}

NODE_MODULE(qrusage, init)
