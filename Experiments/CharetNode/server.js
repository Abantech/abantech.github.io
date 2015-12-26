var express = require('express');
var https = require('https');
var path = require("path");
var app = express();
var ips = [];

app.use("/Images", express.static(__dirname + '/Images'));
app.use("/Scripts", express.static(__dirname + '/Scripts'));
app.use("/Styles", express.static(__dirname + '/Styles'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/fonts", express.static(__dirname + '/fonts'));
app.use("/Libs", express.static(__dirname + '/Libs'));
app.use("/Scripts", express.static(__dirname + '/Scripts'));
app.use("/Styles", express.static(__dirname + '/Styles'));

var fs = require('fs');

var options = {
    pfx: fs.readFileSync('AbantechDev.pfx'),
    passphrase: 'Abantech2012',
    //host: 'James-HP'
};

app.get('/', function (req, res) {
    console.log('\nRequest received from: ' + req.ip);
    
    if (ips.indexOf(req.ip) === -1) {
        ips.push(req.ip);
        console.log('\Unique Request Count: ' + ips.length);
    }
    
    res.sendFile(path.join(__dirname + '/AEC-DesignCharette.html'));
});

https.createServer(options, app).listen(443);