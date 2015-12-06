Test = {};

ActionToFunctionMapping = {
    "Bridge": Test,
    "ActionMappings": [
    {
        Topic: "BothHandsNeutral",
        Source: "Input.Processed.Efficio",
        Action: function (data) {
            if (_viewer) {
                var interactionBox = data.input.Input.interactionBox;
                var explodeFactor = (data.gestureInformation.distance / interactionBox.width) - .1 > 1 ? 1 : data.gestureInformation.distance / interactionBox.width;
                _viewer.explode(explodeFactor);
            }
        },
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 15
        }
    }]
}