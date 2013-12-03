(function () {
  "use strict";

  var http = require('http')
    , path = require('path')
    , fs = require('fs')
    , filename = 'questionnaire.json'
    , filepath = path.join(__dirname, filename)
    ;

  if (fs.existsSync(filepath)) {
    return;
  }

  http.get('http://pastebin.com/raw.php?i=ra0qZDe2', function (res) {
    var text = ''
      ;

    res.on('data', function (buf) {
      text += buf.toString('utf8');
    });
    res.on('end', function () {
      fs.writeFileSync(filepath, text, 'utf8');
    });
  });

}());
