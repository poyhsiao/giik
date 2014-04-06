'use strict';

var rrs = require('rrs');
var Promise = require('bluebird');

module.exports = function (dir) {
  return new Promise(function (resolve, reject) {
    var obj = {
      files: {},
      chapterFiles: []
    };

    var isChapterFile = /chapter\.json$/;

    rrs(dir, { deep: 2 })
      .on('data', function (file) {
        if (file.stats.isFile()) {
          obj.files[file.path] = file;
          if (isChapterFile.test(file.path)) {
            obj.chapterFiles.push(file.path);
          }
        }
      })

      .once('error', function (err) {
        this.pause();
        reject(err);
      })

      .once('end', function () {
        resolve(obj);
      });
  });
};
