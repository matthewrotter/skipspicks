var express = require('express'),
  http = require('http'),
  path = require('path');

var app = express();


app.set('port', 8001);
app.disable('x-powered-by');
app.use(express.logger('dev'));
// app.use(app.router);
app.use('/', express.static(path.join(__dirname, 'dist')));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
