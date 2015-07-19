var bus = require('postal');

if (typeof window != 'undefined') {
    require('./annyang.js');
}



var source = 'Microphone';
var recognition;
var autoRestart = true;
var lastStartedAt = 0;

module.exports = {
    Intitialize: function () {

        if (typeof annyang != 'undefined') {
           
            if (AudioCommands) {
                // Add our commands to annyang
                annyang.addCommands(AudioCommands);
            }
        }
    },
    Start: function () {
        if (annyang) {
            annyang.start();
        }
    }
}

