var express = require('express');
var app = express();
var fs = require("fs");

console.log("Starting up Effcio demo app state server...");

app.get('/updateValues', function (req, res) {

    var values = {};
    fs.readFile(__dirname + "/" + "statedata.json", 'utf8', function (err, data) {
        values = JSON.parse(data);
        console.log("Updating properties ... ");
        for (var propName in req.query) {
            if (req.query.hasOwnProperty(propName)) {
                var value = isNaN(req.query[propName]) ? "'" + req.query[propName] + "'" : req.query[propName];
                eval("values." + propName + " = " + value);
                console.log("    " + propName + " -> " + value);
            }
        }

        fs.writeFile(__dirname + "/" + "statedata.json", JSON.stringify(values), 'utf8', function (err) {
            var message = err ? err : "Successfully Updated State Data!"
            res.end(message);
            return console.log(message);
        });
    });
});

app.get('/getAllValues', function (req, response) {

    fs.readFile(__dirname + "/" + "statedata.json", 'utf8', function (err, data) {
        var values = JSON.parse(data);
        //var message =  values["cameraPosition"].x;
        var message = "Camera current position is at x=" + values.cameraPosition.x + ", y=" + values["cameraPosition"].y + ", z= " + values["cameraPosition"].z;
        console.log(message);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(values));
    });
});

var addNestedProperties = function (parentObject, propertyElements, index) {
    if (propertyElements.length > 0 && index == 1) {
        parentObject[propertyElements[0]] = {};
    }
    else {
        var currentPath = propertyElements.slice(0, index++);

        if (!eval(parentObject + "." + currentPath).hasOwnProperty(propertyElements[index])) {
            eval(parentObject + "." + currentPath + "[" + propertyElements[index] + "] = {}");
        }
    }

    if (index <= propertyElements.length) {
        parentObject = addNestedProperties(parentObject, propertyElements, index);
    }
    else {
        return parentObject;
    }
}

app.get('/getValues', function (req, response) {

    var result = {};

    fs.readFile(__dirname + "/" + "statedata.json", 'utf8', function (err, data) {
        var values = JSON.parse(data);
        for (var propName in req.query) {
            if (req.query.hasOwnProperty(propName)) {
                var propertyPathString = req.query[propName];
                var propertyPath = propertyPathString.split(".");
                result = addNestedProperties(result, propertyPath, 1);
                console("Assigning result." + propName + " from values." + propName);
                eval(result + "." + propName + " = values." + propName);
                //var value = isNaN(req.query[propName]) ? "'" + req.query[propName] + "'" : req.query[propName];
            }
        }

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(values));
    });
})


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port);

})