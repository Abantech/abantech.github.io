define(['leapjs'], function (Leap) {
    var fingerNameLabelMap = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

    function GetFingerLabel(finger) {
        finger = finger || this;
        return fingerNameLabelMap[finger.type];
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

    function AngleToFinger(finger1, useRadians) {
        var finger2 = this;

        var finger0Vector = new THREE.Vector3(finger1.tipPosition[0], finger1.tipPosition[1], finger1.tipPosition[2]);
        var finger1Vector = new THREE.Vector3(finger2.tipPosition[0], finger2.tipPosition[1], finger2.tipPosition[2]);

        var a = finger1.length;
        var b = finger2.length;
        var c = finger0Vector.distanceTo(finger1Vector);

        var numerator = (a * a) + (b * b) - (c * c);
        var denominator = (2 * a * b)

        var angle = Math.acos(numerator / denominator);

        if (useRadians) {
            return angle;
        }

        return THREE.Math.radToDeg(angle);
    }



    function ExtendClasses() {
        var extensions = {
            GetFingerLabel: GetFingerLabel,
            DistanceToFinger: DistanceToFinger,
            AngleToFinger: AngleToFinger
        }

        for (var property in extensions) {
            Leap.Finger.prototype[property] = extensions[property];
        }

        return extensions;
    }

    return {
        ExtendClasses: ExtendClasses
    }
});