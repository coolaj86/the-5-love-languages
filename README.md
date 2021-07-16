# The Five Love Languages Test

## New, Unimproved, Commandline Edition

After creating a test in the format of "The Color Code: Commandline Edition",
the next natural step was to create a test in the format of "The 5 Love Languages".
Also randomized and saved to JSON. W00T!

    npm install -g love-language
    love-language

# Generic Questionnaire

The name of the test is somewhat of a misnomer.
Although originally designed for taking The 5 Love Languages test with friends,
it can be used for any type of test.
Simply specify the name of the questionaire you would like to take.

    love-language ./any-test.json

## Test Format

`questionaire.json` must follow the example file:

```javascript
{ "title": "Welcome to the 5 Love Languages Test"
, "key": "love-languages"
, "groups": {
    "A": "affirmation"
  , "B": "touch"
  , "C": "gifts"
  , "D": "service"
  , "E": "touch"
  }
, "questions": [
    {
        "number": "1"
      , "A": "I like to be affirmed."
      , "B": "I like to be touched."
    }
  , {
        "number": "2"
      , "C": "I like to get gifts."
      , "D": "I like to receive service."
    }
  , {
        "number": "3"
      , "E": "I like to be touched."
      , "A": "I like to be affirmed."
    }
  ]
}
```

You can have as many groups as you like and the keys (A, B, C, etc) may be anything you like
(except the word 'number', which is reserved),
but only two keys may tested per question and you should play each group against each other
group at least 2, but preferrably 3 times.
