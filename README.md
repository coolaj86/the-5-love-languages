The Five Love Languages Test
===

New, Unimproved, Commandline Edition
---

After creating a test in the format of "The Color Code: Commandline Edition", the next natural step was to create a test in the format of "The 5 Love Languages". Also randomized and soved to JSON. W00T!

    npm install -g love-language
    love-language

Generic Questionnaire
===

The name of the test is somewhat of a misnomer.
Although originally designed for taking The 5 Love Languages test with friends,
it can be used for any type of test.
Simply specify the name of the questionaire you would like to take.

    love-language ./any-test.json

Test Format
---

`questionaire.json` must follow the example file:

    [
        {
            "number": "1"
          , "A": "I like to be affirmed."
          , "B": "I like to be touched."
        }
    ]

The keys may be `A`, `B`, `C`, `D`, or `E`. Only two keys may be added per test.

Note: This format may be changed in a future version.
