{
  'targets': [
    {
      'target_name': 'qrusage',
      'sources': [ 'qrusage.cc' ],
      'include_dirs': [ "<!(node -e \"require('nan')\")" ]
    }
  ]
}
