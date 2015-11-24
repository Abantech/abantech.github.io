define(['Helpers/Math'], function (math) {
    var configuration = {
        ExtensionAngle: 30,
        FlexionAngle: 30,
        SupinationMeasure: 145,
        PronationMeasure: {
            Min: -35,
            Max: 35
        },
        UlnarDeviationMeasure: .5,
        RadialDeviationMeasure: -.2,
    };

    function Configure(config) {
        configuration.ExtensionMeasure == config.ExtensionMeasure || configuration.ExtensionMeasure;
        configuration.FlexionMeasure == config.FlexionMeasure || configuration.FlexionMeasure;
        configuration.SupinationMeasure == config.SupinationMeasure || configuration.SupinationMeasure;
        configuration.UlnarDeviationMeasure == config.UlnarDeviationMeasure || configuration.UlnarDeviationMeasure;
        configuration.RadialDeviationMeasure == config.RadialDeviationMeasure || configuration.RadialDeviationMeasure;
    }

    function GetSide(hand) {
        return hand.type === 'right' ? 'Right' : 'Left';
    }

    function GetAngle(hand) {
        return hand.direction[1];
    }

    function Neutral(hand) {
        var neutral;

        if (!Supination(hand) && !Pronation(hand) && !HyperPronation(hand)) {
            neutral = {};
        }

        return neutral;
    }

    function Extension(hand) {
        var extension;
        var angle = ExtensionAngle(hand);

        if (angle > configuration.ExtensionAngle) {
            extension = {
                angle: angle
            }
        }

        return extension;
    }

    function ExtensionAngle(hand) {
        var angleCorrector = 1;
        var measure = hand.roll() * (180 / Math.PI);

        if (GetSide(hand) === 'Right') {
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

    function Flexion(hand) {
        var flexion;
        var angle = FlexionAngle(hand);

        if (angle > configuration.FlexionAngle) {
            flexion = {
                TBD: angle
            }
        }

        return flexion;
    }

    function FlexionAngle(hand) {
        var angleCorrector = 1;
        var measure = hand.roll() * (180 / Math.PI);

        if (GetSide(hand) === 'Right') {
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

    function Supination(hand) {
        var supination;
        var measure = hand.roll() * (180 / Math.PI);
        measure = GetSide(hand) === 'Right' ? -measure : measure;

        if (measure > configuration.SupinationMeasure) {
            supination = {
                TBD: measure
            }
        }

        return supination;
    }

    function Pronation(hand) {
        var pronation;
        var measure = hand.roll() * (180 / Math.PI);
        measure = GetSide(hand) === 'Right' ? -measure : measure;

        if (measure > configuration.PronationMeasure.Min && measure < configuration.PronationMeasure.Max) {
            pronation = {
                TBD: measure
            }
        }

        return pronation;
    }

    function HyperPronation(hand) {
        var pronation;
        var measure = hand.roll() * (180 / Math.PI);
        measure = GetSide(hand) === 'Right' ? -measure : measure;

        if (measure < configuration.PronationMeasure.Min) {
            pronation = {
                TBD: measure
            }
        }

        return pronation;
    }

    function UlnarDeviation(hand) {
        var deviation;
        var measure = GetSide(hand) === 'Right' ? hand.direction[0] - hand.arm.direction()[0] : -1 * hand.direction[0] - (-1) * hand.arm.direction()[0];

        if (measure > configuration.UlnarDeviationMeasure) {
            deviation = {
                TBD: measure
            }
        }

        return deviation;
    }

    function RadialDeviation(hand) {
        var deviation;
        var measure = GetSide(hand) === 'Right' ? hand.direction[0] - hand.arm.direction()[0] : -1 * hand.direction[0] - (-1) * hand.arm.direction()[0];

        if (measure < configuration.RadialDeviationMeasure) {
            deviation = {
                TBD: measure
            }
        }

        return deviation;
    }


    return {
        Configure: Configure,
        GetSide: GetSide,
        GetAngle: GetAngle,
        Neutral: Neutral,
        Extension: Extension,
        ExtensionAngle: ExtensionAngle,
        Flexion: Flexion,
        FlexionAngle: FlexionAngle,
        Supination: Supination,
        Pronation: Pronation,
        HyperPronation: HyperPronation,
        UlnarDeviation: UlnarDeviation,
        RadialDeviation: RadialDeviation
    }
})