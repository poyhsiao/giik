'use strict';

var ctx = module.exports = {};

ctx.createContext = function (obj) {
  obj || (obj = {});
  obj.__proto__ = this;
  return obj;
};

ctx.each = function (target, fn) {
  if (typeof target.length === 'number') {
    Array.prototype.forEach.call(target, fn);
  } else if (typeof target === 'object') {
    Object.keys(target).forEach(function (key) {
      fn(target[key], key);
    });
  }
};
