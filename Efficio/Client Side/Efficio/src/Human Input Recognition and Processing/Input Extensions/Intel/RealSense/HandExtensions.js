define(['realsense', 'Helpers/Math'], function (realsense, math) {

    function GetSide(hand) {
        var hand = hand || this;

        hand.bodySide === 2 ? 'Right' : 'Left';
    }

    function IsFlexed(hand) {
        var hand = hand || this;
        return FlexionAngle(hand) > hand.FlexedAngle;
    }

    function FlexionAngle(hand) {
        var hand = hand || this;
        
        //TODO Find flexion angle
    }

    function IsExtended(hand) {
        var hand = hand || this;
        return ExtensionAngle(hand) > hand.ExtendedAngle;
    }

    function ExtensionAngle(hand) {
        var hand = hand || this;
        
        // TODO find extensions angle
    }

    function IsSupine(hand) {
        var hand = hand || this;

        return SupinationAngle(hand) > hand.SupineAngle;
    }

    function SupinationAngle(hand) {
        var hand = hand || this;
        
        // TODO find supination angle
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
        
        // TODO find pronation angle
    }

    function IsHyperRotated(hand) {
        var hand = hand || this;
        var measure = HyperRotationAngle(hand);

        return measure < -hand.ProneAngleTolerance;
    }

    function HyperRotationAngle(hand) {
        var hand = hand || this;
        
        //TODO find hyper rotation angle
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

        // TODO find deviation measure
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
        }

        for (var property in extensions) {
            intel.realsense.hand.HandData.IHand.prototype[property] = extensions[property];
        }

        return extensions;
    }

    return {
        ExtendClasses: ExtendClasses
    }
})