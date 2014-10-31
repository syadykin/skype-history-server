module.exports = {
  calendar: function(date, month) {
    month = month || 1;
    date.setDate(1);
    date.setMonth(month - 1);
    var today = +new Date(),
        day = (date.getDay() + 6) % 7, // day of the week starting from Monday
        // days in month, there is a hack with 0 in day - month will decrease
        // to what we actully need
        days = (new Date(date.getFullYear(), month, 0)).getDate(),
        weeks = Math.ceil((days + day) / 7), // weeks in month
        w, d, cal = [];

    day = 1 - day;

    for (w = 0; w < weeks; w++) {
      cal[w] = [];
      for (d = 0; d < 7; d++) {
        if (day >= 1 && day <= days) {
          cal[w][d] = {
            day: day,
            future: +date.setDate(day) > today
          };
        } else {
          cal[w][d] = {};
        }
        day++;
      }
    }

    return cal;
  },
  beautify: function(msg) {
    var msgs = msg.split(/[\r\n]/g);

    msgs = msgs.map(function(m) {
      if (m.indexOf('&gt; ') === 0) {
        return '<span class="q">' + m + '</span>';
      }
      return m;
    });

    return msgs.join("<br>");
  }
};
