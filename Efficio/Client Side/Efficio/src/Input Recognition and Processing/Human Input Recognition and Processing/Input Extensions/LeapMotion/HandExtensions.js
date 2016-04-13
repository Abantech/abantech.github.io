define(['leapjs', 'Helpers/Math'], function (Leap, math) {
    var FingerCountLabelsMap = ["Zero", "One", "Two", "Three", "Four", "Five"];

    function GetSide(hand) {
        hand = hand || this;
        return hand.type === 'right' ? 'Right' : 'Left';
    }

    function IsFlexed(hand) {
        hand = hand || this;
        return hand.FlexionAngle() > hand.FlexedAngle;
    }

    function FlexionAngle(hand) {
        hand = hand || this;
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
        hand = hand || this;
        return hand.ExtensionAngle() > hand.ExtendedAngle;
    }

    function ExtensionAngle(hand) {
        hand = hand || this;
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
        hand = hand || this;

        return hand.SupinationAngle() > hand.SupineAngle;
    }

    function SupinationAngle(hand) {
        hand = hand || this;
        var measure = hand.roll() * (180 / Math.PI);
        return hand.type === 'right' ? -measure : measure;
    }

    function IsNeutral(hand) {
        hand = hand || this;

        return !hand.IsSupine() && !hand.IsProne() && !hand.IsHyperRotated();
    }

    function IsProne(hand) {
        hand = hand || this;

        return hand.PronationAngle() > -hand.ProneAngleTolerance && hand.PronationAngle() < hand.ProneAngleTolerance;
    }

    function PronationAngle(hand) {
        hand = hand || this;
        var measure = hand.roll() * (180 / Math.PI);
        return hand.type == 'right' ? -measure : measure;
    }

    function IsHyperRotated(hand) {
        hand = hand || this;
        var measure = hand.HyperRotationAngle();

        return measure < -hand.ProneAngleTolerance;
    }

    function HyperRotationAngle(hand) {
        hand = hand || this;
        var measure = hand.roll() * (180 / Math.PI);
        return hand.type == 'right' ? -measure : measure;
    }

    function IsUlnarDeviated(hand) {
        hand = hand || this;
        return hand.DeviatedMeasurment() > hand.UlnarDeviatedMeasure;
    }

    function IsRadialDeviated(hand) {
        hand = hand || this;
        return hand.DeviatedMeasurment() < hand.RadialDeviatedMeasure;
    }

    function DeviatedMeasurment(hand) {
        hand = hand || this;
        return hand.type === 'right' ? hand.direction[0] - hand.arm.direction()[0] : -1 * hand.direction[0] - (-1) * hand.arm.direction()[0];
    }

    function GetExtendedFingers(hand) {
        hand = hand || this;
        return hand.fingers.filter(function (finger) {
            return finger.IsExtended();
        });
    }

    function GetExtendedFingersIndicies(hand) {
        hand = hand || this;
        return hand.GetExtendedFingers().map(function (finger) {
            return finger.type
        });
    }

    function GetExtendedFingersCount(hand) {
        hand = hand || this;
        return hand.GetExtendedFingers().length;
    }

    function GetExtendedFingersCountLabel(hand) {
        hand = hand || this;
        return hand.FingerCountLabelsMap[hand.GetExtendedFingersCount()];
    }

    function AreRequisiteFingersExtended(neededFingersArray, hand) {
        hand = hand || this;
        var extendedFingers = hand.GetExtendedFingersIndicies();

        return extendedFingers.filter(function (finger) {
            return neededFingersArray.indexOf(finger) != -1
        }).length === neededFingersArray.length && extendedFingers.length === neededFingersArray.length;
    }

    function Fingers(hand) {
        hand = hand || this;
        return hand.fingers;
    }

    function ExtendClasses() {
        var extensions = {
            GetSide: GetSide,

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

            // Fingers
            GetExtendedFingers: GetExtendedFingers,
            GetExtendedFingersIndicies: GetExtendedFingersIndicies,
            GetExtendedFingersCount: GetExtendedFingersCount,
            GetExtendedFingersCountLabel: GetExtendedFingersCountLabel,
            AreRequisiteFingersExtended: AreRequisiteFingersExtended,
            FingerCountLabelsMap: FingerCountLabelsMap,
            Fingers: Fingers

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