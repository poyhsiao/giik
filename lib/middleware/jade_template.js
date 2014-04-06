'use strict';

var path = require('path');
var readFile = require('../read_file');
var debug = require('debug')('giik:jade-template');

var defaultOptions = {
  index: 'index',
  chapter: 'chapter'
};

module.exports = function (dir, options) {
  options || (options = {});

  Object.keys(defaultOptions).forEach(function (key) {
    if (!options.hasOwnProperty(key)) {
      options[key] = defaultOptions[key];
    }
  });

  try {
    var jade = require('jade');
  } catch (e) {
    console.log('  Please run the follwing command to install \'jade\'');
    console.log('  npm install -g jade');
    console.log();
    process.exit(1);
  }

  var templates;

  return function *(next) {
    if (!templates) {
      debug('load templates');
      templates = {};
      templates.index = yield readFile(path.resolve(dir, options.index + '.jade'));
      templates.chapter = yield readFile(path.resolve(dir, options.chapter + '.jade'));
    }

    var compile = jade.compile(this.isIndex ? templates.index : templates.chapter, options);
    this.content = compile(this);

    yield next;
  };
};
