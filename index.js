var path = require('path');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

//app.use("/app", express.static(__dirname + '/app'));
app.use("/dist", express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(app.get('port'), function() {
    console.log('Node app is running!');
})