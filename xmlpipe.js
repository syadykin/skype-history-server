var locomotive = require('locomotive'),
    bootable = require('bootable'),
    app = new locomotive.Application(),
    Mongoose = require('mongoose'),
    format = require('util').format,
    period = +process.argv[2] || 3660, // one hour + 1 minute for sure
    now = ~~(+new Date() / 1000),
    last = now - period;

app.phase(require('bootable-environment')(__dirname + '/config/environments'));
app.phase(bootable.initializers(__dirname + '/config/initializers'));
app.boot(function(err) {
  if (err) {
    console.error(err.message);
    console.error(err.stack);
    return process.exit(-1);
  }

  Mongoose.models.Message
  .find({$or: [{timestamp:{$gte: last}}, {edited_timestamp: {$gte: last}}]})
  .sort('-date')
  .exec(function(err, messages) {
    if (err) {
      console.log(err);
      process.exit(-1);
    }

    process.stdout.write('<?xml version="1.0" encoding="utf-8"?><sphinx:docset xmlns:sphinx="http://sphinxsearch.com/">');
    messages.forEach(function(m) {
      process.stdout.write(format('<sphinx:document id="%d">', m.id));
      process.stdout.write(format('<content><![CDATA[%s]]></content>', m.body_xml));
      process.stdout.write(format('<timestamp>%s</timestamp>', m.timestamp));
      process.stdout.write(format('<date>%s</date>', m.date));
      process.stdout.write(format('<time>%s</time>', m.time));
      process.stdout.write(format('<room><![CDATA[%s]]></room>', m.chatname));
      process.stdout.write(format('<author><![CDATA[%s]]></author>', m.from_dispname));
      process.stdout.write(format('</sphinx:document>'));
    });
    process.stdout.write('</sphinx:docset>');
    process.exit(0);
  });

});
