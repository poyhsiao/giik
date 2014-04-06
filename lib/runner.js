'use strict';

var fs = require('fs');
var co = require('co');
var Promise = require('bluebird');
var readFile = require('./read_file');
var locals = require('./locals');
var debug = require('debug')('giik:runner');

module.exports = function *(chapters, middleware, giik) {
  yield chapters.map(run(middleware, giik));
};

function run(middleware, giik) {
  return function *(chapter) {
    debug('%s (%s)', chapter.name, chapter.sections.length);

    let ctx = Object.create(giik.context);
    let sections = yield Promise.all(chapter.sections.map(readSectionSource));

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
