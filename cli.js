#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , path = require('path')
    , util = require('util')
    , Quizomatic = require('./quizomatic')
    , questionnaireFile = process.argv[2] || path.join(__dirname, './questionnaire.json')
    , directives = require(questionnaireFile)
    , quiz = Quizomatic.create(directives, { randomize: true })
    , responseFilePrefix = directives.key || 'love-languages-test'
    ;

  function presentQuestion(data) {
    var current = data.current
      , remaining = data.remaining
      , total = data.total
      , curNum = String(total - remaining) + ' of ' + total + ' (#' + current.number + ')\n'
      ;

    console.log(curNum);
    if (current.question) {
      console.log(current.question);
    } else {
      console.log("Which describes you best (if torn between two, think of your childhood)?");
    }

    current.choices.forEach(function (choice, i) {
      util.print(String(i + 1) + ') ');
      console.log(choice.response);
    });

    console.log('');
    util.print('answer> ');
  }

  function saveResponses() {
    var filename = responseFilePrefix + '-' + Date.now() + '.json'
      , responses = quiz.responses()
      , totals = quiz.totals()
      ;

    // TODO output as YAML
    fs.writeFile(filename, JSON.stringify(responses, null, '  '), function (err) {
      console.log('You finished', totals);
      Object.keys(totals).sort(function (keyA, keyB) {
        return totals[keyB] - totals[keyA];
      }).forEach(function (key) {
        console.log(key + ':', totals[key]);
      });
      console.log("Now go read the book to learn more!");
      if (err) {
        console.error("couldn't save results");
      } else {
        console.log(process.cwd() + '/' + filename);
      }
      process.stdin.pause();
    });
  }

  function interpretAnswer(num) {
    num = num.replace(/\s/gm, '').toLowerCase();

    if ('p' === num) {
      presentQuestion(quiz.previous());
      return;
    }

    if (!quiz.respond(Number(num) - 1)) {
      console.log("Sorry, I didn't understand you. Respond again with 1, 2, or 'p' (for previous question)");
      return;
    }
    console.log('');

    if (quiz.hasNext()) {
      presentQuestion(quiz.next());
      return;
    }

    saveResponses();
  }

  quiz.shuffle();
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  console.log('');
  console.log(directives.title);
  console.log('');
  console.log('Read the question, type your answer (1 or 2), and hit enter to submit');
  console.log('');
  console.log('Type \'p\' to go to the previous question if you make a boo-boo.');
  console.log('');
  presentQuestion(quiz.next());
  process.stdin.on('data', interpretAnswer);
}());
