var path = require('path');
var express = require('express');
var app = express();

// sets the default PORT that our server uses to listen to incoming requests
app.set('port', (process.env.PORT || 5000));

// exposes the public folder to be exposed to incoming requests
app.use("/public", express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});