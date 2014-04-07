'use strict';

var marked = require('marked');
var thunkify = require('thunkify');

var toHTML = thunkify(marked);

module.exports = function (options) {

  options && (marked.setOptions(options));

  return function *(next) {
    var sections = this.sections;

    if (!sections) {
      yield next;
      return;
    }

    var results = yield sections.map(function (section) {
      return toHTML(section.content);
    });

    results.forEach(function (result, i) {
      sections[i].content = result;
    });

    yield next;
  };
};
