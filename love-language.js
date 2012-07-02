#!/usr/bin/env node
/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var fs = require('fs')
    , util = require('util')
    , questions = require('./5-love-languages-us.json')
    , total = questions.length
    , doneQuestions = []
    , languagesArr = ['A', 'B', 'C', 'D', 'E']
    , languages = {
          'A': 'affirmation'
        , 'B': 'time'
        , 'C': 'gifts'
        , 'D': 'service'
        , 'E': 'touch'
      }
    , languagesMap
    , current
    , responses = {
          totals: {
              affirmation: 0
            , time: 0
            , gifts: 0
            , service: 0
            , touch: 0
          }
        , answers: {
          }
      }
    ;

  function shuffle() {
    return Math.random() - 0.5;
  }

  function presentQuestion() {
    if (true !== (questions.length >= 1)) {
      return false;
    }
    current = questions.pop();

    var curNum = String(total - questions.length) + ' of ' + total + ' (#' + current.number + ')\n'
      ;

    doneQuestions.push(current);
    console.log(curNum);
    if (current.question) {
      console.log(current.question);
    } else {
      console.log("Which describes you best (if torn between two, think of your childhood)?");
    }
    languagesArr.sort(shuffle);
    languagesMap = {};
    languagesArr.forEach(function (lang, i) {
      if (!current[lang]) {
        return;
      }
      if (!languagesMap[1]) {
        languagesMap[1] = lang;
        util.print('1) ');
      } else {
        languagesMap[2] = lang;
        util.print('2) ');
      }
      console.log(current[lang]);
    });
    console.log('');
    util.print('answer> ');

    return true;
  }

  function goBack() {
    // Push the current question back on the stack
    if (true === (doneQuestions.length > 0)) {
      questions.push(doneQuestions.pop());
    }
    if (true !== (doneQuestions.length > 0)) {
      console.log("There are no questions before this one, can't go back!");
    } else {
      // Push the previous question back on the stack
      questions.push(doneQuestions.pop());
    }
    presentQuestion();
  }

  function saveResponses() {
    var filename = 'love-languages-test' + Date.now() + '.json'
      ;

    // TODO output as YAML
    fs.writeFile(filename, JSON.stringify(responses, null, '  '), function (err) {
      console.log('You finished');
      console.log('affirmation:', responses.totals.affirmation);
      console.log('time:', responses.totals.time);
      console.log('gifts:', responses.totals.gifts);
      console.log('service:', responses.totals.service);
      console.log('touch:', responses.totals.touch);
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
    var lang =  languagesMap[num]
      ;

    if (lang) {
      responses.answers[current.number] = languages[lang];
      responses.totals[languages[lang]] += 1;
    } else if ('p' === num) {
      goBack();
      return;
    } else {
      console.log("Sorry, I didn't understand you. Respond again with 1, 2, or 'p' (for previous question)");
      return;
    }
    console.log('');

    if (presentQuestion()) {
      return;
    }

    saveResponses();
  }

  questions.sort(shuffle);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  console.log('');
  console.log('Welcome to The Love Languages Test: Commandline Edition.');
  console.log('');
  console.log('Type \'p\' to go to the previous question if you make a boo-boo.');
  console.log('');
  presentQuestion();
  process.stdin.on('data', interpretAnswer);
  
}());
