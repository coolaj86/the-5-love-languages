(function () {
  "use strict";

  var shuffle = require('knuth-shuffle').knuthShuffle
    , defaultGroups = { 'A': 'affirmation', 'B': 'time', 'C': 'gifts', 'D': 'service', 'E': 'touch' }
    , defaultTitle = 'Welcome to The Love Languages Test: Commandline Edition.'
    , defaultQuestion = 'Which describes you best (if torn between two, think of your childhood)?'
    , proto
    ;

  function Quizomatic(directives, opts) {
    opts = opts || {};

    var me = this
      ;

    me._randomize = opts.randomize;

    me._groups = directives.groups || defaultGroups;
    me._title = directives.title || defaultTitle;
    me._remainingQuestions = directives.questions.slice(0) || directives.slice(0);
    me._total = directives.questions.length;
    me._doneQuestions = [];
    me._groupsArr = Object.keys(me._groups);
    me._current = null;
    me._responses = { totals: {} , answers: {} };
    me._groupsArr.forEach(function (key) {
      me._responses.totals[me._groups[key]] = 0;
    });

    if (me._randomize) {
      shuffle(me._remainingQuestions);
    }
  }
  proto = Quizomatic.prototype;
  proto.next = function () {
    var me = this
      ;

    if (!me.hasNext()) {
      return null;
    }

    me._current = me._remainingQuestions.pop();
    me._current.choices = [];
    me._doneQuestions.push(me._current);

    me._current.question = me._current.question || defaultQuestion;

    // I have a hard time believing that shuffling 2 items
    // would yield unbiased results, so we shuffle the group
    if (me._randomize) {
      shuffle(me._groupsArr);
    }

    me._groupsArr.forEach(function (group) {
      if (me._current[group]) {
        me._current.choices.push({
          group: group
        , response: me._current[group]
        });
      }
    });

    return { current: me._current, remaining: me._remainingQuestions.length, total: me._total };
  };
  proto.hasPrevious = function () {
    var me = this
      ;

    return !!me._doneQuestions.length;
  };
  proto.previous = function () {
    var me = this
      ;

    // TODO leave me._current as a floater, not in doneQs or remainingQs

    // push the current q back on the stack
    if (!me.hasPrevious()) {
      return null;
    }
    me._remainingQuestions.push(me._doneQuestions.pop());

    // push the real previous q back on the stack
    if (!me.hasPrevious()) {
      return null;
    }
    me._remainingQuestions.push(me._doneQuestions.pop());

    return me.next();
  };
  proto.responses = function () {
    var me = this
      ;

    return me._responses.answers;
  };
  proto.totals = function () {
    var me = this
      ;

    return me._responses.totals;
  };
  proto.hasNext = function () {
    var me = this
      ;

    return !!me._remainingQuestions.length;
  };
  proto.respond = function (i) {
    var me = this
      ;

    if (!me._current.choices[i]) {
      return false;
    }

    me._responses.answers[me._current.number] = me._groups[me._current.choices[i].group];
    me._responses.totals[me._groups[me._current.choices[i].group]] += 1;

    return true;
  };
  proto.shuffle = function () {
    var me = this
      ;

    shuffle(me._remainingQuestions);
  };
  function create(dir, opts) {
    return new Quizomatic(dir, opts);
  }

  module.exports.create = create;
}());
