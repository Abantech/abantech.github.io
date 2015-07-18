var express = require('express');
var app = express();
var path = require("path");
var ips = [];

app.use("/img", express.static(__dirname + '/img'));
app.use("/Scripts", express.static(__dirname + '/Scripts'));
app.use("/Styles", express.static(__dirname + '/Styles'));

app.get('/', function (req, res) {
    console.log('\nRequest received from: ' + req.ip);
    
    if (ips.indexOf(req.ip) === -1) {
        ips.push(req.ip);
        console.log('\Unique Request Count: ' + ips.length);
    }
    
    res.sendFile(path.join(__dirname + '/index.html'));
});


var server = app.listen(3001, function () {
    var lines = process.stdout.getWindowSize()[1];
    for (var i = 0; i < lines; i++) {
        console.log('\r\n');
    }
});