// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'LeapRouter';

var ws = require("nodejs-websocket")

// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function (browserConnection) {
    browserConnection.on("text", function (str) {
        console.log("Received " + str)
        conn.sendText(str.toUpperCase() + "!!!")
    })
    browserConnection.on("close", function (code, reason) {
        console.log("Connection closed")
    })

    var leap = ws.connect('ws://localhost:6437/');
    
    leap.on('text', function (message) {
        if (message) {
            server.connections.forEach(function (conn) {
                conn.sendText(message)
            })
        }
    });
}).listen(8889)