var watson_svs = require('./watson-apis');
console.log(watson_svs);
module.exports = {
    serviceTone : function(inputData){
        var res = watson_svs.translator(inputData);
        console.log(res);
        res = watson_svs.tone(res);
        console.log(res);
        return res;
    }
}