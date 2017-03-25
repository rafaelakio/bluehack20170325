var fs = require('fs'),
    _cred = fs.readFileSync("./modules/credentials.json", "utf-8");
var _credJson = JSON.parse(_cred);
const watson = require('watson-developer-cloud');
module.exports = {
  natural: function(inputData){
    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var natural_language_understanding = new NaturalLanguageUnderstandingV1({
      'username': _credJson[2].natural.username,
      'password': _credJson[2].natural.password,
      'version_date': NaturalLanguageUnderstandingV1.VERSION_DATE_2016_01_23
    });

    var parameters = {
      'text': inputData,
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
  tone : function (inputData) {
    var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
    var usr = _credJson[0].tone.username;
    var pss = _credJson[0].tone.password;
    console.log(usr);
    console.log(pss);
    var tone_analyzer = new ToneAnalyzerV3({
        username: usr,
        password: pss,
        version_date: '2016-05-19',
        version: 'v3'
    });

    tone_analyzer.tone({ text: 'Greetings from Watson Developer Cloud!' },
      function(err, tone) {
        if (err)
          console.log(err);
        else
          var resposta = JSON.stringify(tone, null, 2);
        console.log(resposta);
    });
  },
  translator : function(inputData){
    var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
    var user = _credJson[1].translator.username;
    var pass = _credJson[1].translator.password;
    var _url = _credJson[1].translator.url;
    var x =
    {
      username: user, password: pass, url:_url
    };
    var language_translator = new LanguageTranslatorV2(x);
    language_translator.translate({
        text: inputData,
        source: 'en',
        target: 'pt'
      }, function(err, translation) {
        if (err)
          console.log(err)
        else
          var resposta = translation
        console.log(resposta);
        return resposta;
    });
  }
};