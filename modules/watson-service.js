var watson_svs = require('./watson-apis');
var events = require('events');
var eventEmitter = new events.EventEmitter();
console.log(watson_svs);
module.exports = {
    serviceTone : function(inputData){
        resposta = "";
        var fc = function(res){
            console.log('teste1234');
            resposta= res;
            return resposta;
        }
        eventEmitter.on('fc', fc);
        var ff = function(res){
            console.log('teste');
            eventEmitter.emit('fc');
        }
        var f1 = function(input){watson_svs.tone(input, ff)};
        watson_svs.translator(inputData, function(res){return f1(res.translations[0].translation);});
        console.log(resposta);
        return resposta;
    }
}