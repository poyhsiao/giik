'use strict';

var path = require('path');
var readFile = require('../read_file');

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

  var jade = require('jade');
  var templates;

  return function *(next) {
    if (!templates) {
      templates = {};
      templates.index = yield readFile(path.resolve(dir, options.index + '.jade'));
      templates.chapter = yield readFile(path.resolve(dir, options.chapter + '.jade'));
    }

    var compile = jade.compile(this.isIndex ? templates.index : templates.chapter, options);
    this.content = compile(this);
    yield next;
  };
};
