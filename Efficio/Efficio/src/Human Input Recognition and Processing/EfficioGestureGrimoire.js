define(['postal'], function (bus) {
    var source = 'Efficio Gesture Grimoire';

    function DetectPredefinedGestures(data, envelope) {
        var trackingType = data.trackingType || '';

        switch (trackingType) {
            case 'Hands': {
                require(['Human Input Recognition and Processing/Hand Gestures/HandGestureDetectionHandler'], function (hgdh) {
                    hgdh.ProcessInput(data)
                });
                break;
            }
            case 'Body': {
                // Body tracking library here
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
        Initialize: function () {
            
        },

        ProcessInput: function (data, envelope) {
            DetectPredefinedGestures(data, envelope);
        }
    }
});