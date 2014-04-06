'use strict';

var fs = require('fs');
var co = require('co');
var compose = require('koa-compose');
var Promise = require('bluebird');
var readFile = require('./read_file');
var locals = require('./locals');

module.exports = function *(chapters, middleware, giik) {
  middleware = compose(middleware);
  yield chapters.map(run(middleware, giik));
};

function run(middleware, giik) {
  return function *(chapter) {
    let ctx = {};
    let sections = yield Promise.all(chapter.sections.map(readSectionSource));

    ctx.giik = giik;
    ctx.chapter = chapter;
    ctx.sections = sections;
    ctx.sectionsMap = sections.reduce(createSectionsMap, {});
    ctx.number = chapter.number;
    ctx.filename = chapter.slug + '.html';
    ctx.content = sections.reduce(concatSectionContent, '');

    ctx.content = locals(ctx.content, ctx);

    yield co(middleware).bind(ctx);
  }
}

function readSectionSource(section) {
  return readFile(section.source)
    .then(function (content) {
      section.content = content;
      return section;
    });
}

function createSectionsMap(map, section) {
  map[section.number] = section;
  return map;
}

function concatSectionContent(content, section) {
  return content + section.content
    .replace(/{{(.*?)}}/, function (_, v) {
      v = v.trim();
      return '{{' + v.replace(/^section\./, 'sectionsMap[' + String(section.number) + '].') + '}}';
    });
}
