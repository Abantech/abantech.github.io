define(['realsense', 'Helpers/Math'], function (realsense, math) {
    var FingerCountLabelsMap = ["Zero", "One", "Two", "Three", "Four", "Five"];

    function GetSide(hand) {
        var hand = hand || this;

        return hand.bodySide === 2 ? 'Right' : 'Left';
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

    function GetExtendedFingers(hand) {
        hand = hand || this;
        return hand.Fingers().filter(function (finger) {
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
        var fingers = []
        
        for (var i = 0; i < hand.fingerData.length; i++) {
            var tipIndex;

            switch (i) {
                case 0:{
                    tipIndex = intel.realsense.hand.JointType.JOINT_THUMB_TIP;
                    break;
                }
                case 1:{
                    tipIndex = intel.realsense.hand.JointType.JOINT_INDEX_TIP;
                    break;
                }
                case 2:{
                    tipIndex = intel.realsense.hand.JointType.JOINT_MIDDLE_TIP;
                    break;
                }
                case 3:{
                    tipIndex = intel.realsense.hand.JointType.JOINT_RING_TIP;
                    break;
                }
                case 4: {
                    tipIndex = intel.realsense.hand.JointType.JOINT_PINKY_TIP;
                    break;
                }
            }

            fingers[i] = hand.fingerData[i];
            fingers[i].type = i;
            fingers[i].tipJoint = tipIndex;
            fingers[i].TipPosition = function (finger) {
                finger = finger || this;
                return hand.trackedJoints[finger.tipJoint].positionWorld;
            }

            fingers[i].GetFingerLabel = GetFingerLabel;
            fingers[i].DistanceToFinger = DistanceToFinger;
            fingers[i].AngleToFinger = AngleToFinger;
            fingers[i].IsExtended = IsExtended;

        }

        return fingers
    }

    function Joints(hand) {
        hand = hand || this;

        hand.trackedJoints.forEach(function (joint) {
            joint.positionWorld = {
                x: joint.positionWorld.x * 1000,
                y: joint.positionWorld.y * 1000,
                z: joint.positionWorld.z * 1000
            }
        });

        return hand.trackedJoints;
    }

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
        return finger.foldedness > 85;
    }

    function ExtendClasses() {
        var extensions = {
            GetSide: GetSide,
            Joints: Joints,

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
            intel.realsense.hand.HandData.IHand.prototype[property] = extensions[property];
        }

        return extensions;
    }

    return {
        ExtendClasses: ExtendClasses
    }
})