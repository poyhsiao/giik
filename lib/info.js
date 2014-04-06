'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var readFile = require('./read_file');

module.exports = function (files) {

  return Promise.all(files.chapterFiles.map(getInfo))
    .then(sort);

  function sort(sections) {
    return sections.sort(function (a, b) {
      return a.order - b.order;
    });
  }

  function getInfo(file) {
    return readFile(file)
      .then(JSON.parse)
      .then(function (json) {
        json.dir = path.dirname(file);
        json.dirname = path.basename(json.dir);

        var dirname = json.dirname.split('-');

        json.order = dirname.shift() | 0;
        json.slug = dirname.join('-');

        json.sections = (json.sections || [])
          .filter(isFile.bind(null, json.dir));

        return json;
      });
  }

  function isFile(dir, section) {
    var source = path.resolve(dir, section.source);
    var file = files.files[source];

    if (!file) {
      return false;
    }

    section.source = source;

    return file.stats.isFile();
  }
};
