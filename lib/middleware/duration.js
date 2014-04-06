'use strict';

var chalk = require('chalk');
var prettyHrtime = require('pretty-hrtime');

module.exports = function (options) {
  return function *(next) {
    var start = process.hrtime();

    yield next;

    var diff = process.hrtime(start);
    var name = chalk.cyan(this.chapter.name);
    var time = chalk.green(prettyHrtime(diff, options));

    this.giik.log('› %s (%s)', name, time);
  };
};
