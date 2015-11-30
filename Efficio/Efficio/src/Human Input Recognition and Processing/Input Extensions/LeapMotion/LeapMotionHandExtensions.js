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
        var extensions = {
            // Flex Helpers
            IsFlexed: IsFlexed,
            FlexedAngle: 30,
            FlexionAngle: FlexionAngle,

            // Extension Helpers
            IsExtended: IsExtended,
            ExtendedAngle: 30,
            ExtensionAngle: ExtensionAngle,

            // Supination
            IsSupine: IsSupine,
            SupineAngle: 145,
            SupinationAngle: SupinationAngle,

            // Neutral
            IsNeutral: IsNeutral,

            // Pronation
            IsProne: IsProne,
            ProneAngleTolerance: 15,
            PronationAngle: PronationAngle,

            // Hyper Rotation
            IsHyperRotated: IsHyperRotated,
            HyperRotationAngle: HyperRotationAngle,

            // Ulnar Deviation
            IsUlnarDeviated: IsUlnarDeviated,
            UlnarDeviatedMeasure: .5,
            DeviatedMeasurment: DeviatedMeasurment,

            // Radial Deviation
            IsRadialDeviated: IsRadialDeviated,
            RadialDeviatedMeasure: -.2,

            // Others
            GetType: GetType
        }

        for (var property in extensions) {
            Leap.Hand.prototype[property] = extensions[property];
        }

        return extensions;
    }

    return {
        ExtendClasses: ExtendClasses
    }
})