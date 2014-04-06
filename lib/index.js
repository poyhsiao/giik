'use strict';

var co = require('co');
var scan = require('./scanner');
var createChapterInfo = require('./info');
var prepare = require('./prepare');
var createFile = require('./create_file');
var runner = require('./runner');
var noop = require('./noop');
var buildMiddleware = require('./middleware');

var proto = Object.create(buildMiddleware);

module.exports = function (src, dest) {
  var giik = Object.create(proto);

  giik.color = true;
  giik.logIndent = 2;
  giik.src = src;
  giik.dest = dest;
  giik.middleware = [];

  return giik;
};

module.exports.middleware = buildMiddleware;

proto.use = function (middleware) {
  this.middleware.push(middleware);
};

proto.tbuild = function *() {
  var src = this.src;
  var dest = this.dest;
  var files = yield scan(src);
  var chapters = yield createChapterInfo(files); 
  var middleware = this.middleware.slice();
  
  middleware.push(createFile);

  yield prepare(chapters, dest);
  yield runner(chapters, middleware, this);
};

proto.build = function (callback) {
  co(this.tbuild).call(this, callback || noop);
};

proto.log = function () {
  var args = Array.prototype.slice.call(arguments);
  
  args[0] = ' '.repeat(this.logIndent) + args[0];
  
  this.color || (args = args.map(function (arg) {
    if (typeof arg === 'string') {
      arg = arg.replace(/\x1B\[\d+m/g, '');
    }
    return arg;
  }));

  console.log.apply(null, args);
};
