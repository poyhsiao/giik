'use strict';

var co = require('co');

module.exports = function *(chapters, middleware, giik) {
  var ctx = Object.create(giik.context);
  
  ctx.isIndex = true;
  ctx.chapters = chapters;
  ctx.content = '';
  ctx.filename = 'index.html';

  yield co(middleware).bind(ctx);
};
