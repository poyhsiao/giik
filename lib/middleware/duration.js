'use strict';

var chalk = require('chalk');
var prettyHrtime = require('pretty-hrtime');
var debug = require('debug')('giik:duration');

module.exports = function (options) {
  return function *(next) {
    var start = process.hrtime();
    debug('start: %s', start.join(','));

    yield next;

    var diff = process.hrtime(start);

    debug('diff: %s', diff.join(','));

    var name = chalk.cyan(this.isIndex ? 'index' : this.chapter.name);
    var time = chalk.green(prettyHrtime(diff, options));

    this.giik.log('› %s (%s)', name, time);
  };
};
