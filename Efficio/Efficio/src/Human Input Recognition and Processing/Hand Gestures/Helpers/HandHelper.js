define(function () {
    var configuration = {
        ExtensionMeasure: .5,
        FlexionMeasure: -.5,
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
            neutral = { };
        }

        return neutral;
    }

    function Extension(hand) {
        var extension;
        var measure = hand.direction[1] - hand.arm.direction()[1];

        if (measure > configuration.ExtensionMeasure) {
            extension = {
                TBD: measure
            }
        }

        return extension;
    }

    function Flexion(hand) {
        var flexion;
        var measure = hand.direction[1] - hand.arm.direction()[1];

        if (measure < configuration.FlexionMeasure) {
            flexion = {
                TBD: measure
            }
        }

        return flexion;
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
        Flexion: Flexion,
        Supination: Supination,
        Pronation: Pronation,
        HyperPronation: HyperPronation,
        UlnarDeviation: UlnarDeviation,
        RadialDeviation: RadialDeviation
    }
})