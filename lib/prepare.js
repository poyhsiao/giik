'use strict';

var path = require('path');
var thunkify = require('thunkify');
var rimraf = thunkify(require('rimraf'));
var mkdirp = thunkify(require('mkdirp'));

module.exports = function *(chapters, dest) {
  yield rimraf(dest);
  yield mkdirp(dest);
};
