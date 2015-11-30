define(['leapjs', 'Helpers/Math'], function (Leap, math) {

    function IsFlexed(hand) {
        var hand = hand || this;
        return FlexionAngle(hand) > hand.FlexedAngle;
    }

    function FlexionAngle(hand) {
        var hand = hand || this;
        var angleCorrector = 1;
        var measure = hand.roll() * (180 / Math.PI);

        if (hand.type === 'right') {
            measure = -measure;

            if (measure > 0) {
                angleCorrector = hand.direction[0] < 0 ? 1 : -1;
            }
            else {
                angleCorrector = hand.direction[0] > 0 ? 1 : -1;
            }
        }
        else {
            if (measure > 0) {
                angleCorrector = hand.direction[0] > 0 ? 1 : -1;
            }
            else {
                angleCorrector = hand.direction[0] < 0 ? 1 : -1;
            }
        }

        var angle = math.GetAngleBetweenVectors(hand.direction, hand.arm.direction());

        return angle * angleCorrector;
    }

    function IsExtended(hand) {
        var hand = hand || this;
        return ExtensionAngle(hand) > hand.ExtendedAngle;
    }

    function ExtensionAngle(hand) {
        var hand = hand || this;
        var angleCorrector = 1;
        var measure = hand.roll() * (180 / Math.PI);

        if (hand.type === 'right') {
            measure = -measure;

            if (measure > 0) {
                angleCorrector = hand.direction[0] > 0 ? 1 : -1;
            }
            else {
                angleCorrector = hand.direction[0] < 0 ? 1 : -1;
            }
        }
        else {
            if (measure > 0) {
                angleCorrector = hand.direction[0] < 0 ? 1 : -1;
            }
            else {
                angleCorrector = hand.direction[0] > 0 ? 1 : -1;
            }
        }

        var angle = math.GetAngleBetweenVectors(hand.direction, hand.arm.direction());

        return angle * angleCorrector;
    }

    function IsSupine(hand) {
        var hand = hand || this;

        return SupinationAngle(hand) > hand.SupineAngle;
    }

    function SupinationAngle(hand) {
        var hand = hand || this;
        var measure = hand.roll() * (180 / Math.PI);
        return hand.type === 'right' ? -measure : measure;
    }

    function IsNeutral(hand) {
        var hand = hand || this;

        return !IsSupine(hand) && !IsProne(hand) && !IsHyperRotated(hand);
    }

    function IsProne(hand) {
        var hand = hand || this;

        return PronationAngle(hand) > -hand.ProneAngleTolerance && PronationAngle(hand) < hand.ProneAngleTolerance;
    }

    function PronationAngle(hand) {
        var hand = hand || this;
        var measure = hand.roll() * (180 / Math.PI);
        return hand.type == 'right' ? -measure : measure;
    }

    function IsHyperRotated(hand) {
        var hand = hand || this;
        var measure = HyperRotationAngle(hand);

        return measure < -hand.ProneAngleTolerance;
    }

    function HyperRotationAngle(hand) {
        var hand = hand || this;
        var measure = hand.roll() * (180 / Math.PI);
        return hand.type == 'right' ? -measure : measure;
    }

    function IsUlnarDeviated(hand) {
        var hand = hand || this;
        return DeviatedMeasurment(hand) > hand.UlnarDeviatedMeasure;
    }

    function IsRadialDeviated(hand) {
        var hand = hand || this;
        return DeviatedMeasurment(hand) < hand.RadialDeviatedMeasure;
    }

    function DeviatedMeasurment(hand) {
        var hand = hand || this;
        return hand.type === 'right' ? hand.direction[0] - hand.arm.direction()[0] : -1 * hand.direction[0] - (-1) * hand.arm.direction()[0];
    }

    function GetType(hand) {
        var hand = hand || this;
        return hand.type === 'right' ? 'Right' : 'Left';
    }

    function ExtendClasses() {

        // Flex Helpers
        Leap.Hand.prototype.IsFlexed = IsFlexed;
        Leap.Hand.prototype.FlexedAngle = 30;
        Leap.Hand.prototype.FlexionAngle = FlexionAngle;

        // Extension Helpers
        Leap.Hand.prototype.IsExtended = IsExtended;
        Leap.Hand.prototype.ExtendedAngle = 30;
        Leap.Hand.prototype.ExtensionAngle = ExtensionAngle;

        // Supination
        Leap.Hand.prototype.IsSupine = IsSupine;
        Leap.Hand.prototype.SupineAngle = 145;
        Leap.Hand.prototype.SupinationAngle = SupinationAngle;

        // Neutral
        Leap.Hand.prototype.IsNeutral = IsNeutral;

        // Pronation
        Leap.Hand.prototype.IsProne = IsProne;
        Leap.Hand.prototype.ProneAngleTolerance = 15;
        Leap.Hand.prototype.PronationAngle = PronationAngle;

        // Hyper Rotation
        Leap.Hand.prototype.IsHyperRotated = IsHyperRotated;
        Leap.Hand.prototype.HyperRotationAngle = HyperRotationAngle;

        // Ulnar Deviation
        Leap.Hand.prototype.IsUlnarDeviated = IsUlnarDeviated;
        Leap.Hand.prototype.UlnarDeviatedMeasure = .5;
        Leap.Hand.prototype.DeviatedMeasurment = DeviatedMeasurment;

        // Radial Deviation
        Leap.Hand.prototype.IsRadialDeviated = IsRadialDeviated;
        Leap.Hand.prototype.RadialDeviatedMeasure = -.2;

        // Others
        Leap.Hand.prototype.GetType = GetType
    }

    return {
        ExtendClasses: ExtendClasses
    }
})