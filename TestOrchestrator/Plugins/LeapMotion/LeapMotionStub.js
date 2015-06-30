var bus = require('postal');
var source = 'Leap Motion';

//Note: Could this actually be part of the hardware abstraction layer?
//Sample of simulating human input from NUI devices - reads in motion, translates to BVH
module.exports = {
    Init: function () {
        // Leap Motion configuration called here
    },
    
    //NOTE: Shouldn't there always be just ONE function here? Read Input? 
    
    //Should StubPinch be determined here or within the HIRP?
    StubPinch: function () {
        bus.publish({
            channel: "Input.Raw",
            topic: "InputReceived", 
            source: source,
            data: {
                input: "BVH representation of a pinch"
            }
        });
    },
    
    StubGrasp: function () {
        bus.publish({
            channel: "Input.Raw",
            topic: "InputReceived", 
            source: source,
            data: {
                input: "BVH representation of a grasp"
            }
        });
    },
    
    StubCustomGesture: function () {
        bus.publish({
            channel: "Input.Raw",
            topic: "InputReceived", 
            source: source,
            data: {
                input: "BVH representation of a custom gesture"
            }
        });
    },
    
    ReadInput: function () {
        bus.publish({
            channel: "Input.Raw",
            topic: "InputReceived", 
            source: source,
            data: {
                input: "BVH representation of a human input"
            }
        });
    },
    
    Dispose: function () {

    }
}
