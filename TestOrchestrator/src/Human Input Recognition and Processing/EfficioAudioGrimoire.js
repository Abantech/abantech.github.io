var bus = require('postal');
var source = 'Efficio Audio Grimoire';

function CleanseMessage(message){
    while (message.split('')[0] === ' ') {
        message = message.substring(1, message.lenght);
    }
    
    while (message.split('')[message.lenght] === ' ') {
        message = message.substring(0, message.lenght-1);
    }

    return message.toUpperCase();
}

function DetectPhrases(data) {
    
    var message = CleanseMessage(data.message);

    if (message === 'HELLO') {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'Hello', 
            source: source,
            data: {
                message: message
            }
        });
    }
    
    if (message === 'next'.toUpperCase()) {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'Next', 
            source: source,
            data: {
                message: message
            }
        });
    }
    
    if (message === 'last'.toUpperCase()) {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'Last', 
            source: source,
            data: {
                message: message
            }
        });
    }
    
    if (message === 'About'.toUpperCase()) {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'About', 
            source: source,
            data: {
                message: message
            }
        });
    }
    
    if (message === 'Samples'.toUpperCase()) {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'Samples', 
            source: source,
            data: {
                message: message
            }
        });
    }
    
    if (message === 'Download'.toUpperCase()) {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'Download', 
            source: source,
            data: {
                message: message
            }
        });
    }
    
    if (message === 'Home'.toUpperCase()) {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'Home', 
            source: source,
            data: {
                message: message
            }
        });
    }
    
    bus.publish({
        channel: "Input.Audio.Processed.Efficio",
        topic: 'Unmapped', 
        source: source,
        data: {
            message: message
        }
    });
    
    // Spanish LOL
    if (message === 'Contact'.toUpperCase()) {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'Contact', 
            source: source,
            data: {
                message: message
            }
        });
    }
    
    if (message === 'siguiente'.toUpperCase()) {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'Next', 
            source: source,
            data: {
                message: message
            }
        });
    }
    
    if (message === 'último'.toUpperCase()) {
        bus.publish({
            channel: "Input.Audio.Processed.Efficio",
            topic: 'Last', 
            source: source,
            data: {
                message: message
            }
        });
    }
}

module.exports = {
    Initialize: function () {
        
    },
    
    ProcessInput: function (data) {
        // Where input is processed and Custom Gestures are published on the channel
        DetectPhrases(data);
    }
}