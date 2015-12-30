define(['postal'], function (bus) {

    var source = 'Efficio Device Grimoire';
    var channel = 'Input.Processed.Efficio.Device';
    var dictionary = 'Device';
    var trackingType = 'Orientation';
    var orientationProcessor;

    function RawOrientationData(data) {
        var gestureName = "RawOrientationData";
        var gestureInformation = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary)

        bus.publish({
            channel: channel,
            topic: gestureName,
            source: source,
            data: {
                Input: data,
                GestureInformation: gestureInformation
            }
        });
    };

        function ProcessInput(data) {

        if (!orientationProcessor) {
            orientationProcessor = {
                Name: name,
                TrackingType: trackingType,
                Dictionary: dictionary,
                Positions: {
                    RawOrientationData: RawOrientationData,
                }
            }
        }

        for (var position in orientationProcessor.Positions) {
            orientationProcessor.Positions[position](data);
        }

        return orientationProcessor;

    }


    return {
        ProcessInput: ProcessInput
    }
})