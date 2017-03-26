/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    wt_service = require('./modules/watson-service');

var xpto = require('./modules/watson-apis');

var app = express();

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'my_sample_db',
    tickets: 'tickets'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudantNoSQLDB/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
}

function initDBConnection() {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    console.log("sdfadsfasdfasdfasdfasdfasdf");
    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Once you have the credentials, paste them into a file called vcap-local.json.
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        //dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
        var vcapServices = JSON.parse(fs.readFileSync("vcap-local.json", "utf-8"));
        dbCredentials.url = vcapServices.VCAP_SERVICES.cloudantNoSQLDB[0].credentials.url;
    }

    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    return cloudant.use(dbCredentials.dbName);
}

initDBConnection();

app.get('/', routes.index);
app.get('/followup', function(req, res){
    res.render('followup.html', { title: 'Cloudant Boiler Plate' });
});
app.get('/dashboard', function(req, res){
    res.render('dashboards.html', { title: 'Cloudant Boiler Plate' });
});

function createResponseData(id, name, value, attachments) {

    var responseData = {
        id: id,
        name: sanitizeInput(name),
        value: sanitizeInput(value),
        attachements: []
    };


    attachments.forEach(function(item, index) {
        var attachmentData = {
            content_type: item.type,
            key: item.key,
            url: '/api/favorites/attach?id=' + id + '&key=' + item.key
        };
        responseData.attachements.push(attachmentData);

    });
    return responseData;
}

function sanitizeInput(str) {
    return String(str).replace(/&(?!amp;|lt;|gt;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

var saveDocument = function(id, name, value, response) {

    if (id === undefined) {
        // Generated random id
        id = '';
    }

    db.insert({
        name: name,
        value: value
    }, id, function(err, doc) {
        if (err) {
            console.log(err);
            response.sendStatus(500);
        } else
            response.sendStatus(200);
        response.end();
    });

}

app.post('/api/favorites', function(request, response) {

    console.log("Create Invoked..");
    console.log("Name: " + request.body.name);
    console.log("Value: " + request.body.value);

    // var id = request.body.id;
    var name = sanitizeInput(request.body.name);
    var value = sanitizeInput(request.body.value);

    saveDocument(null, name, value, response);

});

app.delete('/tickets', function(request, response) {

    var db = initDBConnection();
    db = cloudant.use(dbCredentials.calls);
    console.log("Delete Invoked..");
    db.get(id, {
        revs_info: true
    }, function(err, doc) {
        if (!err) {
            db.destroy(doc._id, doc._rev, function(err, res) {
                // Handle response
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                } else {
                    response.sendStatus(200);
                }
            });
        }
    });

});

recuperaId = function(db, id) {
    
    console.log("recuperaID: " + id);

    db.get(id, {
        revs_info: true
    }, function(err, doc) {
        if (!err) {
            console.log(doc);
        }
    });
};

app.post('/tickets', function(req,resp){
    var db = initDBConnection();
    db = cloudant.use(dbCredentials.calls);
    db.insert(
        {
            _id: resp.body.id,
            status: resp.body.status,
            script: resp.body.script
            },
            id,
            function(err, doc) {
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                } else {
                    response.sendStatus(200);
                }
                response.end();
        }
    );
});

app.get('/tickets', function(req, resp){
    var db = initDBConnection();
    console.log('tickets database');
    db = cloudant.use(dbCredentials.tickets);
    resp.writeHead(200, {"Content-Type": "application/json"});
    var j1;
    db.list(function(err, body){
        body.rows.forEach(function(document) {
            db.get(document.id, {revs_info: true}, function(err, doc) {
                if (!err) {
                    var x = doc['tickets'];
                    var json_ = JSON.stringify(x);
                    resp.write(json_);
                    resp.end();
                }
            });
        });
    });
});

app.get('/calls', function(req, resp){
    var db = initDBConnection();
    db = cloudant.use(dbCredentials.calls);
    resp.writeHead(200, {"Content-Type": "application/json"});
    var j1;
    db.list(function(err, body){
        body.rows.forEach(function(document) {
            db.get(document.id, {revs_info: true}, function(err, doc) {
                if (!err) {
                    var x = doc['calls'];
                    var json_ = JSON.stringify(x);
                    resp.write(json_);
                    resp.end();
                }
            });
        });
    });
});

app.get('/contatos', function(req, resp){
    var db = initDBConnection();
    db = cloudant.use(dbCredentials.contatos);
    resp.writeHead(200, {"Content-Type": "application/json"});
    var j1;
    db.list(function(err, body){
        body.rows.forEach(function(document) {
            db.get(document.id, {revs_info: true}, function(err, doc) {
                if (!err) {
                    var x = doc['contatos'];
                    var json_ = JSON.stringify(x);
                    resp.write(json_);
                    resp.end();
                }
            });
        });
    });
});

app.get('/testeTone', function(req, res){
    res.writeHead(200, {"Content-Type": "application/json"});
    var db = initDBConnection();
    dbCredentials.baseNova = 'baseNova';
    cloudant.db.create(dbCredentials.baseNova, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.baseNova + ', it might already exist.');
        }
    });
    db = cloudant.use(dbCredentials.baseNova);
     wt_service.serviceTone("API Reference pages provide an easy way for you to see the methods that are provided by a service and how to call them. This column provides general information and explains the parameters that are required by methods when called from different languages. Its content changes based on the selected langauge. On screens that are wide enough, the right column provides selectable tabs that show how to make sample method calls in REST (via the cURL command), Node.js, and Java, and includes example responses to those calls. On narrow screens, these examples are inlined, and you can access the page navigation and switch between REST, Node.js, and Java examples from the menu at the left.",
     db);
    res.end();
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});

app.use("/public", express.static(__dirname + '/public'));

app.get("/testeangular", function(req, res){
    res.render('hello.html', { title: 'teste' });
});
