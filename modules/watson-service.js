var watson_svs = require('./watson-apis');
//console.log(watson_svs);
module.exports = {
    serviceTone : function(inputData, db){
        var f1 = function(input, db){watson_svs.tone(input, db, function(res, db){
                db.insert({
                    value: res
                }, id, function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });
        })};
        watson_svs.translator(inputData, db, function(res, db){f1(res.translations[0].translation, db);});
    }
}