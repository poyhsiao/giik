'use strict';

var co = require('co');

module.exports = function *(chapters, middleware, giik) {
  var ctx = giik.context.createContext({
    isIndex: true,
    chapters: chapters,
    content: '',
    uri: '/',
    filename: 'index.html'
  });

  yield co(middleware).bind(ctx);
};
