'use strict';

var fs = require('fs');
var Promise = require('bluebird');

module.exports = function (file) {
  return new Promise(function (resolve, reject) {
    var err;
    var content = '';
    fs.createReadStream(file, { encoding: 'utf8' })
      .on('data', function (chunk) {
        content += chunk;
      })
      .once('error', function (e) {
        err = e;
        reject(e);
      })
      .once('end', function () {
        if (!err) {
          resolve(content);
        }
      });
  });
};
