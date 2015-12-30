define(['postal'], function (bus) {
    var source = 'Efficio Gesture Grimoire';
    var efficioGestureGrimoire = { Name: source };

    function DetectPredefinedGestures(data, envelope) {
        var trackingType = data.TrackingType || '';

        switch (trackingType) {
            case 'Hands': {
                require(['Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/HandGestureDetectionHandler'], function (hgdh) {
                    efficioGestureGrimoire.HandProcessor = hgdh.ProcessInput(data)
                });
                break;
            }
            case 'Body': {
                // Body tracking library here
                require(['Input Recognition and Processing/Human Input Recognition and Processing/Body Positions/BodyPositionDetectionHandler'], function (bpdh) {
                    bpdh.ProcessInput(data)
                });
                break;
            }
            case 'Head': {
                // Head tracking library here
                break;
            }
            case 'Brain': {
                // Brain tracking library here
                break;
            }
            case 'Sensor': {
                // Other sensory input library here
                break;
            }
        }
    }

    return {
        Initialize: function () {
            return efficioGestureGrimoire;
        },

        ProcessInput: function (data, envelope) {
            DetectPredefinedGestures(data, envelope);
        }
    }
});