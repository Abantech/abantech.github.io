define(['leapjs'], function (Leap) {
    var fingerNameLabelMap = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

    function GetFingerLabel(finger) {
        finger = finger || this;
        return fingerNameLabelMap[finger.type];
    }

    function DistanceToFinger(finger1, finger2) {
        finger2 = finger2 || this;

        var finger1Tip = finger1.TipPosition();
        var finger2Tip = finger2.TipPosition();
        var x2 = finger1Tip.x;
        var y2 = finger1Tip.y;
        var z2 = finger1Tip.z;
        var x1 = finger2Tip.x;
        var y1 = finger2Tip.y;
        var z1 = finger2Tip.z;

        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1))
    }

    function AngleToFinger(finger1, useRadians) {
        var finger2 = this;

        var finger0Vector = new THREE.Vector3(finger1.TipPosition().x, finger1.TipPosition().y, finger1.TipPosition().z);
        var finger1Vector = new THREE.Vector3(finger2.TipPosition().x, finger2.TipPosition().y, finger2.TipPosition().z);

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

    function IsExtended(finger) {
        finger = finger || this;
        return finger.extended;
    }

    function TipPosition(finger) {
        finger = finger || this;
        var tempPosition = finger.tipPosition;
        return {
            x: tempPosition[0],
            y: tempPosition[1],
            z: tempPosition[2]
        }
    }

    function ExtendClasses() {
        var extensions = {
            GetFingerLabel: GetFingerLabel,
            DistanceToFinger: DistanceToFinger,
            AngleToFinger: AngleToFinger,
            IsExtended: IsExtended,
            TipPosition: TipPosition
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