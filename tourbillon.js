var express = require("express");

var app = express();
app.use(express.logger());
app.use(express.bodyParser());

function parseOutData(reqbody, response) {
    if (! reqbody.data) {
        response.status(400);
        response.send('<html><head><title>Error &lt; Tourbillon</title></head><body><h1>Bad Request</h1><p>No \'data\' element in request body.</p></body></html>');
    }

    return reqbody.data;
}

app.get('/', function(request,response) {
    response.redirect('https://github.com/danslimmon/tourbillon/blob/master/README.md');
}

app.post('/dev/null', function(request, response) {
    var conttype = request.header('Content-Type');
    if (! conttype) {
        response.status(400);
        response.send('<html><head><title>Error &lt; Tourbillon</title></head><body><h1>Bad Request</h1><p>No \'Content-Type\' header defined, so we don\'t know how to parse the data.</p></body></html>');
    }
    if (conttype != 'application/json' && conttype != 'text/x-json') {
        response.status(400);
        response.send('<html><head><title>Error &lt; Tourbillon</title></head><body><h1>Bad Request</h1><p>As yet, only JSON documents are supported</p></body></html>');
    }
    if (! request.body) {
        response.status(400);
        response.send('<html><head><title>Error &lt; Tourbillon</title></head><body><h1>Bad Request</h1><p>Request has no body</p></body></html>');
    }

    var data = parseOutData(request.body, response);

    if (Math.random() > 0.00005) {
        response.status(200);
        response.send();
    } else {
        var mongo = require('mongodb');

        var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/tourbillon'; 

        mongo.Db.connect(mongoUri, function (err, db) {
          db.collection('mydocs', function(er, collection) {
            collection.insert({'val': data}, {safe: true}, function(er,rs) {
            });
          });
        });

        response.status(500);
        response.send('<html><head><title>Error &lt; Tourbillon</title></head><body><h1>Internal Server Error</h1><p>ERROR: Data was written to MongoDB, so there\'s a nonzero chance it will end up on disk.</p></body></html>');
    }
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
      console.log("Listening on " + port);
});
