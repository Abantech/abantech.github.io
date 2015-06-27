var bus = require('postal');
var source = 'Custom Gesture Libraries';

function LoadCustomGestures(){
    // Custom Gestures created by the user will be loaded here
}

function DetectCustomGestures(data){
    var libraryName = 'custom library 1';
    var gestureName = 'my custom gesture';
    var gestureData = 'my custom gesture data';

    // If custom gesture is detected
    if (data.input === 'Looks like custom gesture') {
      
        bus.publish({
            channel: "Input.Processed.Custom." + libraryName,
            topic: gestureName, 
            source: source,
            data: gestureData
        });
    }
}

module.exports = {
    Initialize: function (){
        LoadCustomGestures();
    },

    ProcessInput: function (data){

        // Where input is processed and Custom Gestures are published on the channel
        DetectCustomGestures(data);
    }
}