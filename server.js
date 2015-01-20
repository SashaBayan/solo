var express = require('express');
var app = express();

app.use(express.static(__dirname))

app.use(express.static(__dirname + '/soundmanager'))
/*app.get('/', function(){
  next();
});

app.get('/sasha', function(){
  
});*/

var server = app.listen(8000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening on host ' + host + 'and port ' + port);
})