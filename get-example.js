"use strict";

var https = require("https");
var path = require("path");
var fs = require("fs");
var filename = "questionnaire.json";
var filepath = path.join(__dirname, filename);
var url = "https://pastebin.com/raw/ra0qZDe2";
//var url = 'https://raw.githubusercontent.com/coolaj86/5-love-languages-test/5f4adf3e96197c8fa31e368ef24362deab222739/questionnaire.json';

if (fs.existsSync(filepath)) {
  return;
}

https.get(url, function (res) {
  if (res.statusCode < 200 || res.statusCode >= 300) {
    console.error("failed to https.get example questionnaire");
  }

  var text = "";
  res.on("data", function (buf) {
    text += buf.toString("utf8");
  });
  res.on("end", function () {
    fs.writeFileSync(filepath, text, "utf8");
  });
});
