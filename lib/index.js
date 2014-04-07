'use strict';

var co = require('co');
var compose = require('koa-compose');
var merge = require('merge-descriptors');
var scan = require('./scanner');
var createChapterInfo = require('./info');
var prepare = require('./prepare');
var createFile = require('./create_file');
var runner = require('./runner');
var genindex = require('./genindex');
var noop = require('./noop');
var buildMiddleware = require('./middleware');
var context = require('./context');

var proto = Object.create(buildMiddleware);

module.exports = function (src, dest) {
  var giik = Object.create(proto);

  giik._context = context.createContext();
  giik.color = true;
  giik.logIndent = 2;
  giik.src = src;
  giik.dest = dest;
  giik.middleware = [];

  giik.context.giik = giik;

  return giik;
};

Object.defineProperty(proto, 'context', {
  get: function () {
    return this._context;
  },

  set: function (context) {
    merge(this._context, context);
  }
});

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
  middleware = compose(middleware);

  yield prepare(chapters, dest);
  yield runner(chapters, middleware, this);
  yield genindex(chapters, middleware, this);
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
