define(['postal'], function (bus) {
    var source = 'Efficio Gesture Grimoire';
    var ActiveGesturesDictionary;
    var efficioGestureGrimoire = { Name: source };

    function DetectPredefinedGestures(data, envelope) {
        var trackingType = data.TrackingType || '';

        switch (trackingType) {
            case 'Hands': {
                require(['Human Input Recognition and Processing/Hand Gestures/HandGestureDetectionHandler'], function (hgdh) {
                    efficioGestureGrimoire.HandProcessor = hgdh.ProcessInput(data, ActiveGesturesDictionary)
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

        return efficioGestureGrimoire;
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