define([], function () {
    var fingerNameLabelMap = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

    function GetFingerLabel(finger) {
        finger = finger || this;
        return fingerNameLabelMap[fingerIndex];
    }

    function DistanceToFinger(finger1, finger2) {
        finger2 = finger2 || this;

        var finger1Tip = finger1.tipPosition;
        var finger2Tip = finger2.tipPosition;
        var x2 = finger1Tip[0];
        var y2 = finger1Tip[1];
        var z2 = finger1Tip[2];
        var x1 = finger2Tip[0];
        var y1 = finger2Tip[1];
        var z1 = finger2Tip[2];

        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1))
    }

    function ExtendClasses() {
        var extensions = {
            GetFingerLabel: GetFingerLabel,
            DistanceToFinger: DistanceToFinger
        }

        for (var property in extensions) {
            Leap.Hand.prototype[property] = extensions[property];
        }

        return extensions;
    }

    return {
        ExtendClasses: ExtendClasses
    }
});