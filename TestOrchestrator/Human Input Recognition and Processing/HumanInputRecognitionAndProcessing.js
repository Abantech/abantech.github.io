var bus = require('postal');
var customGestureLibraries = require('./CustomGestureLibrariesAccess.js');
var efficioGestureLibrary = require('./EfficioGestureGrimoire.js');

var subscription;

module.exports = {
    Initialize: function () {
        customGestureLibraries.Initialize();
        efficioGestureLibrary.Initialize();
        
        subscription = bus.subscribe({
            channel: "Input.Raw",
            topic: "*",
            callback: function (data, envelope) {
                    customGestureLibraries.ProcessInput(data);
                    efficioGestureLibrary.ProcessInput(data);
            }
        });
    },

    Dispose: function (){
        subscription.unsubscribe();
    }
}
