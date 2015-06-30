var bus = require('postal');
var source = 'Leap Motion';

module.exports = {
    Init: function () {
        // Leap Motion configuration called here
    },
    
    StubPinch: function () {
        bus.publish({
            channel: "Input.Raw",
            topic: "InputReceived", 
            source: source,
            data: {
                input: "Looks like pinch"
            }
        });
    },
    
    StubGrasp: function () {
        bus.publish({
            channel: "Input.Raw",
            topic: "InputReceived", 
            source: source,
            data: {
                input: "Looks like grasp"
            }
        });
    },
    
    StubCustomGesture: function () {
        bus.publish({
            channel: "Input.Raw",
            topic: "InputReceived", 
            source: source,
            data: {
                input: "Looks like custom gesture"
            }
        });
    },
    
    Dispose: function () {

    }
}
