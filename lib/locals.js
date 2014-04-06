'use stricts';

module.exports = function (str, data) {
  return str.replace(/{{(.*?)}}/g, function (_, v) {
    v = v.trim();

    var keys = [];
    
    v
      .replace(/\\\./g, '\uffff')
      .replace(/\\\[/g, '\ufffe')
      .replace(/\\\]/g, '\ufffd')
      .replace(/\[(.*?)\]/, function (_, j) {
        return ''
          + '['
          + j.replace(/\./g, '\uffff')
          + ']';
      })
      .split('.')
        .forEach(function (_) {
          var child;

          _ = _.replace(/\[(.*)\]/g, function (_, k) {
            child = k
              .trim()
              .replace(/\uffff/g, '.');
            return '';
          });

          _ = _
            .replace(/\ufffd/g, ']')
            .replace(/\ufffe/g, '[')
            .replace(/\uffff/g, '.');

          keys.push(_);

          child && keys.push(child);
        });

    var key;
    var d = data;

    while (key = keys.shift()) {
      d = d[key];
      if (d === undefined) {
        break;
      }
    }

    return String(d);
  });
};
