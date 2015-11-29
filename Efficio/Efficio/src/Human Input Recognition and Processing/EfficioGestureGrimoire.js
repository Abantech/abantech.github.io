define(['postal'], function (bus) {
    var source = 'Efficio Gesture Grimoire';
    var ActiveGesturesDictionaryCopy = {};

    function DetectPredefinedGestures(data, envelope) {
        var trackingType = data.trackingType || '';

        switch (trackingType) {
            case 'Hands': {
                require(['Human Input Recognition and Processing/Hand Gestures/HandGestureDetectionHandler'], function (hgdh) {
                    hgdh.ProcessInput(data, ActiveGesturesDictionary)
                });
                break;
            }
            case 'Body': {
                // Body tracking library here
                require(['Human Input Recognition and Processing/Body Positions/BodyPositionDetectionHandler'], function (bpdh) {
                    bpdh.ProcessInput(data, ActiveGesturesDictionary)
                });
                break;
            }
            case 'Face': {
                // Face tracking library here
                break;
            }
            case 'Brain': {
                // Brain tracking library here
                break;
            }
        }
    }



    return {
        Initialize: function (agd) {
            ActiveGesturesDictionary = agd;
        },

        ProcessInput: function (data, envelope) {
            DetectPredefinedGestures(data, envelope);
        }
    }
});