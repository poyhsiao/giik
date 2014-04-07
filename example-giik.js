'use strict';

var pygmentize = require('pygmentize-bundled');

module.exports = function (giik) {
  giik.context = {
    abc: 123
  };

  giik.use(giik.duration());

  giik.use(giik.markdown({
    highlight: function (code, lang, callback) {
      pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
        callback(err, result.toString());
      });
    }
  }));

  giik.use(giik.jadeTemplate('./template'));
  giik.use(giik.copy(['./static']));

};
