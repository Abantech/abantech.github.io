define(['postal'], function (bus) {
    var source = 'Efficio Device Grimoire';
    var efficioGestureGrimoire = { Name: source };

    function DetectPredefinedGestures(data, envelope) {
        var trackingType = data.TrackingType || '';

        switch (trackingType) {
            case 'Orientation': {
                require(['Input Recognition and Processing/Device Input Recognition and Processing/Orientation/Orientation'], function (hgdh) {
                    efficioGestureGrimoire.HandProcessor = hgdh.ProcessInput(data)
                });
                break;
            }
        }
    }



    return {
        Initialize: function (agd) {
            return efficioGestureGrimoire;
        },

        ProcessInput: function (data, envelope) {
            DetectPredefinedGestures(data, envelope);
        }
    }
});