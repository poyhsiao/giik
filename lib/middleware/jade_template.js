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

  dir = path.resolve(process.cwd(), dir);

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
  var indexFilepath = path.join(dir, options.index + '.jade');
  var chapterFilepath = path.join(dir, options.chapter + '.jade');

  return function *(next) {
    if (!templates) {
      debug('load templates');
      templates = {};
      templates.index = yield readFile(indexFilepath);
      templates.chapter = yield readFile(chapterFilepath);
    }

    var template;
    var filename;

    if (this.isIndex) {
      template = 'index';
      filename = indexFilepath;
    } else {
      template = 'chapter';
      filename = chapterFilepath;
    }

    options.filename = filename;

    var compile = jade.compile(templates[template], options);
    this.content = compile(this);

    yield next;
  };
};
