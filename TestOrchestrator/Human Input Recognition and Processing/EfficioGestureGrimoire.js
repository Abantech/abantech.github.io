var bus = require('postal');
var source = 'Efficio Gesture Grimoire';

function ConnectToGestureSource() {
    // Create connection to gesture source
}

function DetectPredefinedGestures(data) {
    // If predefined gesture is detected
    if (data.input === 'Looks like pinch') {        
        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: 'Pinch', 
            source: source,
            data: 'Pinch Data'
        });
    }

    if (data.input === 'Looks like grasp') {
        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: 'Grasp', 
            source: source,
            data: 'Grasp Data'
        });
    }
}

module.exports = {
    Initialize: function () {
        ConnectToGestureSource();
    },
    
    ProcessInput: function (data) {
        
        // Where input is processed and Custom Gestures are published on the channel
        DetectPredefinedGestures(data);
    }
}