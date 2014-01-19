//dependencies
var express = require('express'),
  http = require('http'),
  path = require('path');

//create express app
var app = express();

// add our config
app.config = require('./config');

//config all
app.configure(function() {
  //settings
  app.disable('x-powered-by');
  app.set('port', 4001);
  app.set('strict routing', true);

  //middleware
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());

  // cross-domain stuff
  var allowCrossDomain = function(req, res, next) {
    var origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
  };
  app.use(allowCrossDomain);
  app.options('/*', function(req, res) {
    res.send(200);
  });

  // app.use(app.router);

  //error handler
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(500);
    res.send({ error: err.message });
  });
});

//route requests
require('./routes')(app);

//create server
var server = http.createServer(app);


server.listen(app.get('port'), function() {
  console.log('express server listening on port ' + app.get('port'));
});
