#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , path = require('path')
    , util = require('util')
    , shuffle = require('knuth-shuffle').knuthShuffle
    , questionnaireFile = process.argv[2] || path.join(__dirname, './questionnaire.json')
    , directives = require(questionnaireFile)
    , questions = directives.questions || directives
    , languages = directives.groups || { 'A': 'affirmation', 'B': 'time', 'C': 'gifts', 'D': 'service', 'E': 'touch' }
    , title = directives.title || 'Welcome to The Love Languages Test: Commandline Edition.'
    , responseFilePrefix = directives.key || 'love-languages-test'
    , total = questions.length
    , doneQuestions = []
    , languagesArr = Object.keys(languages)
    , languagesMap
    , current
    , responses = { totals: {} , answers: {} }
    ;

  languagesArr.forEach(function (key) {
    responses.totals[languages[key]] = 0;
  });

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
    shuffle(languagesArr);
    languagesMap = {};
    languagesArr.forEach(function (lang) {
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
    var filename = responseFilePrefix + '-' + Date.now() + '.json'
      ;

    // TODO output as YAML
    fs.writeFile(filename, JSON.stringify(responses, null, '  '), function (err) {
      console.log('You finished');
      Object.keys(responses.totals).sort(function (keyA, keyB) {
        return responses.totals[keyB] - responses.totals[keyA];
      }).forEach(function (key) {
        console.log(key + ':', responses.totals[key]);
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

  shuffle(questions);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  console.log('');
  console.log(title);
  console.log('');
  console.log('Read the question, type your answer (1 or 2), and hit enter to submit');
  console.log('');
  console.log('Type \'p\' to go to the previous question if you make a boo-boo.');
  console.log('');
  presentQuestion();
  process.stdin.on('data', interpretAnswer);
  
}());
