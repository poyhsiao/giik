'use strict';

var co = require('co');
var path = require('path');
var thunkify = require('thunkify');
var ncp = thunkify(require('ncp'));

module.exports = function (dirs, basedir) {
  if (typeof dirs === 'string') {
    dirs = [dirs];
  }

  basedir || (basedir = process.cwd());

  dirs = dirs.map(function (dir) {
    return path.resolve(basedir, dir);
  });

  return function *(next) {
    if (!this.isIndex) {
      yield next;
      return;
    }
    
    dirs.map(function (dir) {
      return ncp(dir, this.giik.dest);
    }.bind(this));

    yield next;
  };
};
