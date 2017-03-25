module.exports = {
  natural: function(){
    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var natural_language_understanding = new NaturalLanguageUnderstandingV1({
      'username': '{username}',
      'password': '{password}',
      'version_date': '2017-02-27'
    });

    var parameters = {
      'text': 'IBM is an American multinational technology company headquartered in Armonk, New York, United States, with operations in over 170 countries.',
      'features': {
        'entities': {
          'emotion': true,
          'sentiment': true,
          'limit': 2
        },
        'keywords': {
          'emotion': true,
          'sentiment': true,
          'limit': 2
        }
      }
    }

    natural_language_understanding.analyze(parameters, function(err, response) {
      if (err)
        console.log('error:', err);
      else
        console.log(JSON.stringify(response, null, 2));
    });
  },
  tone : function () {
    var watson = require('watson-developer-cloud');

    var tone_analyzer = watson.tone_analyzer({
    username: '{username}',
    password: '{password}',
    version: 'v3',
    version_date: '2016-05-19 '
    });

    tone_analyzer.tone({ text: 'A word is dead when it is said, some say. Emily Dickinson' },
    function(err, tone) {
        if (err)
        console.log(err);
        else
        console.log(JSON.stringify(tone, null, 2));
    })
  }
};