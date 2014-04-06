#!/usr/bin/env node --harmony

'use strict';

var path = require('path');
var nopt = require('nopt');
var create = require('../lib');

var pkg = require('../package');

var knownOpts = {
  'config': path,
  'src': String,
  'dest': String,
  'help': Boolean,
  'no-color': Boolean
};

var shortHands = {
  h: ['--help'],
  s: ['--src'],
  d: ['--dest'],
  c: ['--config']
};

var configFile = path.resolve('./giik.js');
var parsed = nopt(knownOpts, shortHands, process.argv, 2);

console.log();

if (parsed.help) {
  let help = ''
    + '  ' + pkg.name + '@' + pkg.version + '\n\n'
    + '  Options:\n'
    + '    --help, --no-color, --src=[path], --dest=[path], --config=[path]';

  console.log(help);
  console.log();

  process.exit();
}

var giik = create(parsed.src, parsed.dest);

parsed.config && (configFile = parsed.config);

var wrapper = require(configFile);

wrapper(giik);

giik.build(function (err) {
  if (err) {
    giik.log(err.stack);
    console.log();
    process.exit(1);
  }
  console.log();
});
