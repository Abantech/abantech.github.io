var bus = require('postal');
var customGestureLibraries = require('./CustomGestureLibrariesAccess.js');
var efficioGestureLibrary = require('./EfficioGestureGrimoire.js');

var subscription;

module.exports = {
    Initialize: function () {
        customGestureLibraries.Initialize();
        efficioGestureLibrary.Initialize();
        
        //This recieves the input from the BVH stream that is derived from the data provided by the NUI device
        subscription = bus.subscribe({
            channel: "Input.Raw",
            topic: "*",
            callback: function (data, envelope) {
                //Is this where we figure out the intent behind the BVH input?
                customGestureLibraries.ProcessInput(data);
                efficioGestureLibrary.ProcessInput(data);
                //Question: Should the above be mutually exclusive? What if conflicting instructions are recieved?
            }
        });
    },

    Dispose: function (){
        subscription.unsubscribe();
    }
}
