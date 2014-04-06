'use strict';

var marked = require('marked');
var thunkify = require('thunkify');

var toHTML = thunkify(marked);

module.exports = function (options) {

  options && (marked.setOptions(options));

  return function *(next) {
    this.content = yield toHTML(this.content);
    yield next;
  };
};
