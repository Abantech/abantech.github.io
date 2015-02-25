Leap.Finger.prototype.angleToFinger = function (finger, useRadians)
{
    var finger0Vector = new THREE.Vector3(this.tipPosition[0], this.tipPosition[1], this.tipPosition[2]);
    var finger1Vector = new THREE.Vector3(finger.tipPosition[0], finger.tipPosition[1], finger.tipPosition[2]);

    var a = this.length;
    var b = finger.length;
    var c = mathHelper.DistanceBetweenPoints(finger0Vector, finger1Vector);

    var numerator = (a * a) + (b * b) - (c * c);
    var denominator = (2 * a * b)

    var angle = Math.acos(numerator / denominator);

    if (useRadians)
    {
        return angle;
    }

    return THREE.Math.radToDeg(angle);
}

Leap.Finger.prototype.touchingTip = function (finger, distance, scaleFactor)
{
    if (!distance)
    {
        distance = 10;
    }

    if (!scaleFactor)
    {
        scaleFactor = 1;
    }

    return this.distanceToFingerTip(finger) < (distance * scaleFactor);
}

Leap.Finger.prototype.distanceToFingerTip = function (finger)
{
    var finger0Vector = new THREE.Vector3(this.tipPosition[0], this.tipPosition[1], this.tipPosition[2]);
    var finger1Vector = new THREE.Vector3(finger.tipPosition[0], finger.tipPosition[1], finger.tipPosition[2]);

    return mathHelper.DistanceBetweenPoints(finger0Vector, finger1Vector);
}