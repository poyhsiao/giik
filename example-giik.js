'use strict';

var path = require('path');
var pygmentize = require('pygmentize-bundled');

module.exports = function (giik) {

  giik.use(giik.duration());

  giik.use(giik.markdown({
    highlight: function (code, lang, callback) {
      pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
        callback(err, result.toString());
      });
    }
  }));

  giik.use(giik.jadeTemplate(path.join(__dirname, 'template')));

};
