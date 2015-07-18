var bus = require('postal');
var customGestureLibraries = require('./CustomGestureLibrariesAccess.js');
var efficioGestureLibrary = require('./EfficioGestureGrimoire.js');
var efficioAudioGrimoire = require('./EfficioAudioGrimoire.js');


module.exports = {
    Initialize: function () {
        customGestureLibraries.Initialize();
        efficioGestureLibrary.Initialize();
        
        //This recieves the input from the BVH stream that is derived from the data provided by the NUI device
        bus.subscribe({
            channel: "Input.Raw",
            topic: "*",
            callback: function (data, envelope) {
                //Is this where we figure out the intent behind the BVH input?
                customGestureLibraries.ProcessInput(data);
                efficioGestureLibrary.ProcessInput(data, envelope);
                //Question: Should the above be mutually exclusive? What if conflicting instructions are recieved?
            }
        });

        bus.subscribe({
            channel: "Input.Audio.Raw",
            topic: "*",
            callback: function (data, envelope) {
                efficioAudioGrimoire.ProcessInput(data);
            }
        });
    }
}
