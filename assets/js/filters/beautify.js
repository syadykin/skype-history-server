module.exports = [function() {
  return function(msg) {
    var msgs = (msg || '').split(/[\r\n]/g);

    msgs = msgs.map(function(m) {
      if (m.indexOf('&gt; ') === 0) {
        return '<span class="q">' + m + '</span>';
      }
      return m;
    });

    return msgs.join("<br>");
  };
}];
