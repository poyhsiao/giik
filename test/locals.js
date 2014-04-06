'use strict';

var expect = require('chai').expect;

var locals = require('../lib/locals');

describe('locals(str, obj)', function () {
  it('should work', function () {
    var obj = {
      site: {
        name: 'Google',
        url: 'http://google.com'
      }
    };
    
    var result = locals('<a href="{{ site[url] }}">{{ site.name }}</a>', obj);

    expect(result).to.equal('<a href="http://google.com">Google</a>');
  });

  it('should work', function () {
    var obj = {
      site: {
        url: 'http://google.com'
      }
    };
    
    var result = locals('<a href="{{ site.url }}">{{ site.admin.name }}</a>', obj);

    expect(result).to.equal('<a href="http://google.com">undefined</a>');
  });
});
