/**
 * Copyright (C) 2014,2016 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

#include <nan.h>
using v8::FunctionTemplate;

#include <sys/time.h>
#include <sys/resource.h>

#ifndef RUSAGE_THREAD
#  define RUSAGE_THREAD         RUSAGE_SELF
#endif


NAN_METHOD(zero) {
    info.GetReturnValue().Set(Nan::New(0));
}

NAN_METHOD(cputime) {
    struct rusage ru;
    int who = (info[0]->IsNumber()) ? info[0]->Int32Value() : RUSAGE_SELF;

    getrusage(who, &ru);
    double cpuUsed =
        ru.ru_utime.tv_sec + ru.ru_utime.tv_usec * 1e-6 +
        ru.ru_stime.tv_sec + ru.ru_stime.tv_usec * 1e-6;

    info.GetReturnValue().Set(Nan::New(cpuUsed));
}

NAN_METHOD( cpuusage ) {
    struct rusage ru;
    int who = (info[0]->IsNumber()) ? info[0]->Int32Value() : RUSAGE_SELF;

    getrusage(who, &ru);

    v8::Local<v8::Array> usage_array = Nan::New<v8::Array>(2);
    Nan::Set(usage_array, 0, Nan::New((double)ru.ru_utime.tv_sec * 1e6 + (double)ru.ru_utime.tv_usec));
    Nan::Set(usage_array, 1, Nan::New((double)ru.ru_stime.tv_sec * 1e6 + (double)ru.ru_stime.tv_usec));

    info.GetReturnValue().Set(usage_array);
    return;

    // faster to populate an array of 2 with 2 doubles than to build one string
    char timebuf[1000];
    sprintf(timebuf, "%llu %llu",
        ((unsigned long long)ru.ru_utime.tv_sec * 1000000 + ru.ru_utime.tv_usec),
        ((unsigned long long)ru.ru_stime.tv_sec * 1000000 + ru.ru_stime.tv_usec));
    info.GetReturnValue().Set(Nan::New(timebuf).ToLocalChecked());

    // 2x faster to populate an array than an object
    v8::Local<v8::Object> usage_object = Nan::New<v8::Object>();
    Nan::Set(usage_object, Nan::New("user").ToLocalChecked(),        Nan::New((double)ru.ru_utime.tv_sec * 1e6 + (double)ru.ru_utime.tv_usec));
    Nan::Set(usage_object, Nan::New("system").ToLocalChecked(),      Nan::New((double)ru.ru_stime.tv_sec * 1e6 + (double)ru.ru_stime.tv_usec));
    info.GetReturnValue().Set(usage_object);
}

NAN_METHOD( gettimeofday ) {
    struct timeval tv;

    gettimeofday(&tv, NULL);
    double time = tv.tv_sec + tv.tv_usec * 1e-6;

    info.GetReturnValue().Set(Nan::New(time));
}

NAN_METHOD( microtime ) {
    struct timeval tv;

    gettimeofday(&tv, NULL);
    double time = tv.tv_sec * 1e6 + tv.tv_usec;

    info.GetReturnValue().Set(Nan::New(time));
}

NAN_METHOD( getrusage_array ) {
    struct rusage ru;
    int who = (info[0]->IsNumber()) ? info[0]->Int32Value() : RUSAGE_SELF;

    getrusage(who, &ru);

    // faster to zero-detect than to create new Number every time
    v8::Local<v8::Number> zero = Nan::New(0);
    #define _number(v)     (((v) > 0) ? Nan::New((double)v) : zero)

    // note: nan-2.2.0 is unable to Nan::New() a long (ambiguous), cast to double
    v8::Local<v8::Array> usage_array = Nan::New<v8::Array>(16);
    Nan::Set(usage_array, 0, Nan::New((double)ru.ru_utime.tv_sec + (double)ru.ru_utime.tv_usec * 1e-6));
    Nan::Set(usage_array, 1, Nan::New((double)ru.ru_stime.tv_sec + (double)ru.ru_stime.tv_usec * 1e-6));
    Nan::Set(usage_array, 2, Nan::New((double)ru.ru_maxrss));
    Nan::Set(usage_array, 4,  _number(ru.ru_ixrss));
    Nan::Set(usage_array, 3,  _number(ru.ru_idrss));
    Nan::Set(usage_array, 5,  _number(ru.ru_isrss));
    Nan::Set(usage_array, 6, Nan::New((double)ru.ru_minflt));
    Nan::Set(usage_array, 7,  _number(ru.ru_majflt));
    Nan::Set(usage_array, 8,  _number(ru.ru_nswap));
    Nan::Set(usage_array, 9,  _number(ru.ru_inblock));
    Nan::Set(usage_array, 10, _number(ru.ru_oublock));
    Nan::Set(usage_array, 11, _number(ru.ru_msgsnd));
    Nan::Set(usage_array, 12, _number(ru.ru_msgrcv));
    Nan::Set(usage_array, 13, _number(ru.ru_nsignals));
    Nan::Set(usage_array, 14, Nan::New((double)ru.ru_nvcsw));
    Nan::Set(usage_array, 15, Nan::New((double)ru.ru_nivcsw));

    info.GetReturnValue().Set(usage_array);
}

NAN_MODULE_INIT(InitAll) {
    Nan::Set(target, Nan::New("RUSAGE_SELF").ToLocalChecked(),          Nan::New(RUSAGE_SELF)),
    Nan::Set(target, Nan::New("RUSAGE_CHILDREN").ToLocalChecked(),      Nan::New(RUSAGE_CHILDREN)),
    Nan::Set(target, Nan::New("RUSAGE_THREAD").ToLocalChecked(),        Nan::New(RUSAGE_THREAD)),

    Nan::Set(target, Nan::New("zero").ToLocalChecked(),                 Nan::GetFunction(Nan::New<FunctionTemplate>(zero)).ToLocalChecked()),
    Nan::Set(target, Nan::New("cputime").ToLocalChecked(),              Nan::GetFunction(Nan::New<FunctionTemplate>(cputime)).ToLocalChecked()),
    Nan::Set(target, Nan::New("cpuusage").ToLocalChecked(),             Nan::GetFunction(Nan::New<FunctionTemplate>(cpuusage)).ToLocalChecked()),
    Nan::Set(target, Nan::New("gettimeofday").ToLocalChecked(),         Nan::GetFunction(Nan::New<FunctionTemplate>(gettimeofday)).ToLocalChecked()),
    Nan::Set(target, Nan::New("microtime").ToLocalChecked(),            Nan::GetFunction(Nan::New<FunctionTemplate>(microtime)).ToLocalChecked()),
    Nan::Set(target, Nan::New("getrusage_array").ToLocalChecked(),      Nan::GetFunction(Nan::New<FunctionTemplate>(getrusage_array)).ToLocalChecked()),

    ((void)0) ;
}

NODE_MODULE(qrusage, InitAll)
