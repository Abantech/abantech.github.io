define(['postal'], function (bus) {
    var source = 'Custom Gesture Libraries';
    var ActiveGesturesDictionaryCopy = {};

    function LoadCustomGestures() {
        // Custom Gestures created by the user will be loaded here
    }

    function DetectCustomGestures(data, envelope) {
        var libraryName = 'custom library 1';
        var gestureName = 'my custom gesture';
        var gestureData = 'my custom gesture data';

        // If custom gesture is detected
        if (data.input === 'BVH representation of a custom gesture') {

            bus.publish({
                channel: "Input.Processed.Custom." + libraryName,
                topic: gestureName,
                source: source,
                data: gestureData
            });
        }
    }

    return {
        Initialize: function (ActiveGesturesDictionary) {
            ActiveGesturesDictionaryCopy = ActiveGesturesDictionary;
        },
        ProcessInput: function (data, envelope) {

            // Where input is processed and Custom Gestures are published on the channel
            DetectCustomGestures(data, envelope);
        }
    }
})