define(['postal', 'Input Recognition and Processing/ActiveGestureDictionary'], function (bus, agd) {

    var ipr = { ActiveGesturesDictionary: agd, PrototypeExtensions: {}, };

    function Initialize() {

        require(['Input Recognition and Processing/Human Input Recognition and Processing/HumanInputRecognitionAndProcessing'], function (humanInputRecognitionAndProcessing) {
            ipr.HumanInputRecognitionAndProcessing = humanInputRecognitionAndProcessing.Initialize();
        }), function (err) {
            bus.publish({
                channel: 'UserNotification',
                topic: 'Warn',
                source: source,
                data: {
                    message: 'No custom gesture library configured'
                }
            });
        };

        require(['Input Recognition and Processing/Device Input Recognition and Processing/DeviceInputRecognitionAndProcessing'], function (deviceInputRecognitionAndProcessing) {
            ipr.DeviceInputRecognitionAndProcessing = deviceInputRecognitionAndProcessing.Initialize();
        }), function (err) {
            bus.publish({
                channel: 'UserNotification',
                topic: 'Warn',
                source: source,
                data: {
                    message: 'No custom gesture library configured'
                }
            });
        };

        return ipr;
    }

    return {
        Initialize: Initialize
    }
});