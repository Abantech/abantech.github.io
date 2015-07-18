var bus = require('postal');
var source = 'Efficio Gesture Grimoire';

var timeSinceLastSwipe = new Date().getTime();

function ConnectToGestureSource() {
    // Create connection to gesture source
}

function DetectPredefinedGestures(data, envelope) {
    
    if (data.input && data.input.hands && data.input.hands.length > 0) {
        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: 'HandDetected', 
            source: source,
            data: {
                handCount: data.input.hands.length
            }
        });
    }
    
    if (data.input && data.input.hands && data.input.hands.length === 1) {
        var type = data.input.hands[0].type;
        
        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: type + 'HandDetected', 
            source: source,
            data: {
                handCount: data.input.hands[0]
            }
        });
    }
    
    if (data.input && data.input.hands && data.input.hands.length === 0) {
        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: 'NoHandsDetected', 
            source: source,
            data: {
                message: 'No hands detected'
            }
        });
    }
    
    if (data.input && data.input.hands && data.input.hands.length === 1) {
        var hand = data.input.hands[0];
        
        if (hand.fingers[1].extended && hand.fingers[2].extended && hand.fingers[3].extended && hand.fingers[4].extended) {
            var direction = '';
            
            if (data.input.hands[0].direction[1] > .5) {
                direction = 'Up'
            }
            
            if (data.input.hands[0].direction[1] < .2) {
                direction = 'Down'
            }
            
            if (direction != '') {
                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: direction + 'DirectionDetected', 
                    source: source,
                    data: {
                        message: direction + ' Direction Detected'
                    }
                });
            }
        }
    }
    

    // Fingers Exteded
    if (data.input && data.input.hands && data.input.hands.length === 1) {
        var extendedFingersCount = 0;
        var fingerCountLabels = ["Zero", "One", "Two", "Three", "Four", "Five"];
        var extendedFingersIndicies = [];

        data.input.hands[0].fingers.forEach(function (finger, index) {
            if (finger.extended) {
                extendedFingersCount++;
                extendedFingersIndicies.push(index);
            }
        });
        
        var fingerCountLabel = fingerCountLabels[extendedFingersCount];

        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: fingerCountLabel + 'FingersExtended', 
            source: source,
            data: {
                frame: data.input,
                extendedFingers : extendedFingersIndicies
            }
        });

    }
}


module.exports = {
    Initialize: function () {
        ConnectToGestureSource();
    },
    
    ProcessInput: function (data, envelope) {
        // Where input is processed and Custom Gestures are published on the channel
        DetectPredefinedGestures(data, envelope);
    }
}