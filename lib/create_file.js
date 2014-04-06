'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function *(next) {
  var filepath = path.join(this.giik.dest, this.filename);
  var stream = fs.createWriteStream(filepath, { encoding: 'utf8' });
  var content = this.content;

  yield function (cb) {
    stream.end(content, cb);
  };

  yield next;
};
