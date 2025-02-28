﻿define('Input Recognition and Processing/ActiveGestureDictionary',[],function () {
    var ActiveGesturesDictionary = {}

    //function RetrieveEntry(trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function RetrieveEntry(trackingType, gestureName) {
        trackingType = trackingType || 'NoTrackingType';

        // Get all subdictionaries; workaround for '...' not being supported
        var argumentsLength = arguments.length;
        if (argumentsLength > 2) {
            var dictionaries = [];

            for (var i = 2; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        if (!gestureName) {
            console.error('gestureName argument required.');
        }

        if (!ActiveGesturesDictionary[trackingType]) {
            ActiveGesturesDictionary[trackingType] = {};
        }

        var path = ActiveGesturesDictionary[trackingType];

        if (dictionaries) {
            var dictLength = dictionaries.length;

            for (var i = 0; i < dictLength; i++) {
                if (!path[dictionaries[i]]) {
                    path[dictionaries[i]] = {};
                }

                path = path[dictionaries[i]];
            }
        }

        return path[gestureName];
    }

    //function AddEntry(entry, trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function AddEntry(entry, trackingType, gestureName) {
        trackingType = trackingType || 'NoTrackingType';

        if (!gestureName) {
            console.error('gestureName argument required.');
        }

        // Get all subdictionaries; workaround for '...' not being supported
        var argumentsLength = arguments.length;
        if (argumentsLength > 3) {
            var dictionaries = [];

            for (var i = 3; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        if (!ActiveGesturesDictionary[trackingType]) {
            ActiveGesturesDictionary[trackingType] = {};
        }

        var path = ActiveGesturesDictionary[trackingType];

        if (dictionaries) {
            var dictLength = dictionaries.length;

            for (var i = 0; i < dictLength; i++) {
                if (!path[dictionaries[i]]) {
                    path[dictionaries[i]] = {};
                }

                path = path[dictionaries[i]];
            }
        }

        path[gestureName] = entry;
    }

    //function CreateOrUpdateEntry(trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function CreateOrUpdateEntry(trackingType, gestureName) {

        // Get all subdictionaries; workaround for '...' not being supported
        var dictionaries = [];
        var argumentsLength = arguments.length;
        if (argumentsLength > 2) {
            for (var i = 2; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        var retrieveVars = [trackingType, gestureName].concat(dictionaries);

        var entry = RetrieveEntry.apply(null, retrieveVars);

        if (!entry) {
            entry = {
                // Time properties
                StartTime: new Date(),
                EndTime: null,
                GestureDuration: function () {
                    var endTime = this.EndTime || new Date();

                    return Math.abs(this.StartTime - endTime)
                },

                // Fire count properties
                FireCount: 0,
                FirstFire: function () { return this.FireCount === 0 }
            }

            var addVars = [entry].concat(retrieveVars);
            AddEntry.apply(null, addVars);
        }
        else {
            entry.FireCount++;
        }

        return entry;
    }

    //function DeleteEntry(trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function DeleteEntry(trackingType, gestureName) {
        trackingType = trackingType || 'NoTrackingType';
        var toDelete;

        if (!ActiveGesturesDictionary[trackingType]) {
            return;
        }

        // Get all subdictionaries; workaround for '...' not being supported
        var argumentsLength = arguments.length;
        if (argumentsLength > 2) {
            var dictionaries = [];

            for (var i = 2; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        var toDelete = ActiveGesturesDictionary;

        if (dictionaries) {
            var lastEntry;
            var dictLength = dictionaries.length;
            toDelete = toDelete[trackingType];

            for (var i = 0; i < dictLength; i++) {
                if (!toDelete[dictionaries[i]]) {
                    return;
                }

                if (!(i === dictLength - 1)) {
                    toDelete = toDelete[dictionaries[i]];
                }
                else {
                    lastEntry = dictionaries[i];
                }
            }
        }
        else {
            lastEntry = trackingType;
        }

        if (gestureName && toDelete) {
            delete toDelete[lastEntry][gestureName];
        }
        else {
            delete toDelete[lastEntry];
        }
    }

    //function DeleteAllBut(trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function DeleteAllBut(trackingType, gestureName) {
        trackingType = trackingType || 'NoTrackingType';

        if (!ActiveGesturesDictionary[trackingType]) {
            return;
        }

        if (!gestureName) {
            throw Exception('gestureName argument required.');
        }

        // Get all subdictionaries; workaround for '...' not being supported
        var argumentsLength = arguments.length;
        if (argumentsLength > 2) {
            var dictionaries = [];

            for (var i = 2; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        var toDelete = ActiveGesturesDictionary[trackingType];

        if (dictionaries) {
            var dictLength = dictionaries.length;

            for (var i = 0; i < dictLength; i++) {
                if (!toDelete[dictionaries[i]]) {
                    return;
                }

                toDelete = toDelete[dictionaries[i]];
            }
        }

        for (var prop in toDelete) {
            if (prop != gestureName) {
                delete toDelete[prop];
            }
        }
    }

    return {
        ActiveGesturesDictionary: ActiveGesturesDictionary,
        CreateOrUpdateEntry: CreateOrUpdateEntry,
        RetrieveEntry: RetrieveEntry,
        DeleteEntry: DeleteEntry,
        DeleteAllBut: DeleteAllBut
    }
});

﻿'use strict'

define('Helpers/Math',[],function () {

    function GetAngleBetweenVectors(vector1, vector2)
    {
        var a = {
            x: vector1[0],
            y: vector1[1],
            z: vector1[2]
        }

        var b = {
            x: vector2[0],
            y: vector2[1],
            z: vector2[2]
        }

        var axb = a.x * b.x + a.y * b.y + a.z * b.z;
        var vector1Length = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
        var vector2Length = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);

        return Math.acos(axb / (vector1Length * vector2Length)) * (180 / Math.PI)
    }

    function DistanceBetweenTwoPoints(point1, point2) {
        if (!Array.isArray(point1)) {
            point1 = [point1]
        }

        if (!Array.isArray(point2)) {
            point2 = [point2]
        }

        var a = {
            x: point1[0],
            y: point1[1] || 0,
            z: point1[2] || 0
        }

        var b = {
            x: point2[0],
            y: point2[1] || 0,
            z: point2[2] || 0
        }

        return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y) + (b.z - a.z) * (b.z - a.z))
    }

    function MidpointBetweenTwoPoints(point1, point2) {
        var a = {
            x: point1[0],
            y: point1[1] || 0,
            z: point1[2] || 0
        }

        var b = {
            x: point2[0],
            y: point2[1],
            z: point2[2] || 0
        }

        return [(b.x + a.x) / 2, (b.y + a.y) / 2, (b.z + a.z) / 2];
    }

    function Velocity(point1, point2, time) {
        return (DistanceBetweenTwoPoints(point1, point2) / (time / 1000));
    }

    return {
        GetAngleBetweenVectors: GetAngleBetweenVectors,
        DistanceBetweenTwoPoints: DistanceBetweenTwoPoints,
        MidpointBetweenTwoPoints: MidpointBetweenTwoPoints,
        Velocity: Velocity
    }
})
;
﻿define('Input Recognition and Processing/Human Input Recognition and Processing/Input Extensions/LeapMotion/HandExtensions',['leapjs', 'Helpers/Math'], function (Leap, math) {
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
            return finger.extended;
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
            FingerCountLabelsMap: FingerCountLabelsMap

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
;
﻿define('Input Recognition and Processing/Human Input Recognition and Processing/Input Extensions/LeapMotion/FingerExtensions',['leapjs'], function (Leap) {
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

﻿define('Input Recognition and Processing/Human Input Recognition and Processing/Input Extensions/Intel/RealSense/HandExtensions',['realsense', 'Helpers/Math'], function (realsense, math) {

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
;
﻿define('Input Recognition and Processing/Human Input Recognition and Processing/CustomGestureLibrariesAccess',['postal'], function (bus) {
    var source = 'Custom Gesture Libraries';
    var ActiveGesturesDictionaryCopy = {};

    function LoadCustomGestures() {
        // Custom Gestures created by the user will be loaded here
    }

    function DetectCustomGestures(data, envelope) {
        var libraryName = 'custom library 1';
        var gestureName = 'my custom gesture';
        var gestureData = 'my custom gesture data';

        // If custom gesture is detected
        if (data.input === 'BVH representation of a custom gesture') {

            bus.publish({
                channel: "Input.Processed.Custom." + libraryName,
                topic: gestureName,
                source: source,
                data: gestureData
            });
        }
    }

    return {
        Initialize: function (ActiveGesturesDictionary) {
            ActiveGesturesDictionaryCopy = ActiveGesturesDictionary;
        },
        ProcessInput: function (data, envelope) {

            // Where input is processed and Custom Gestures are published on the channel
            DetectCustomGestures(data, envelope);
        }
    }
})
;
﻿define('Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandPositionDetection',['postal', 'Helpers/Math'], function (bus, math) {
    var source = 'Efficio Gesture Grimoire';
    var name = 'One Hand Gesture Detector';
    var dictionary = 'OneHandPosition';
    var trackingType = 'Hands';
    var side;
    var oneHandPositionDetector;
    var ActiveGesturesDictionary = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary;

    //TODO add start and end hands/positions to all gestures

    /*
          Name:           {Side} Hand Detected
   
          Outputs:        RightHandDetected
                          LeftHandDetected
           
          Description:    Informs consumer how many fingers fingers are extended and on which hand 
       */
    function SideHandDetected(hand, data) {
        var gestureName = side + 'HandDetected';

        //TODO: Clear all entries in agd
        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: gestureName,
            source: source,
            data: {
                Input: data,
                Hand: hand,
                GestureInformation: gestureInformation
            }
        });
    }

    /*
          Name:           {Side} Hand {Count} Fingers Extended
   
          Outputs:        RightHandZeroFingersExtended
                          RightHandOneFingersExtended
                          RightHandTwoFingersExtended
                          RightHandThreeFingersExtended
                          RightHandFourFingersExtended
                          RightHandFiveFingersExtended
                          LeftHandZeroFingersExtended
                          LeftHandOneFingersExtended
                          LeftHandTwoFingersExtended
                          LeftHandThreeFingersExtended
                          LeftHandFourFingersExtended
                          LeftHandFiveFingersExtended
           
          Description:    Informs consumer how many fingers fingers are extended and on which hand 
       */
    function SideHandCountFingersExtended(hand, data) {
        var possibleGestureNames = ['HandZeroFingersExtended', 'HandOneFingersExtended', 'HandTwoFingersExtended', 'HandThreeFingersExtended', 'HandFourFingersExtended', 'HandFiveFingersExtended'];
        var extendedFingerCountLabel = hand.GetExtendedFingersCountLabel();
        var extendedFingersIndicies = hand.GetExtendedFingersIndicies();

        var gestureName = side + 'Hand' + extendedFingerCountLabel + 'FingersExtended';

        // Add gesture to dictionary
        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

        if (!gestureInformation.StartPosition) {
            gestureInformation.StartPosition = hand.palmPosition;
        }
        else {
            gestureInformation.EndPosition = hand.palmPosition;
        }

        // Remove all other possible entries
        possibleGestureNames.forEach(function (tempGestureName) {
            if (side + tempGestureName != gestureName) {
                ActiveGesturesDictionary.DeleteEntry(trackingType, side + tempGestureName, dictionary, side);
            }
        })

        //TODO: Clear all entries in agd and add new entry

        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: gestureName,
            source: source,
            data: {
                Input: data,
                Hand: hand,
                GestureInformation: gestureInformation,
                ExtendedFingers: extendedFingersIndicies
            }
        });
    }; // END {Side} Hand {Count} Fingers Extended

    /*
   Name:           {Side} Hand {Finger} Extended

   Outputs:        RightHandThumbFingerExtended
                   RightHandIndexFingerExtended
                   RightHandMiddleFingerExtended
                   RightHandRingFingerExtended
                   RightHandPinkyFingerExtended
                   LeftHandThumbFingerExtended
                   LeftHandIndexFingerExtended
                   LeftHandMiddleFingerExtended
                   LeftHandRingFingerExtended
                   LeftHandPinkyFingerExtended
   
   Description:    Informs consumer which fingers are extended and on which hand 
*/
    function SideHandFingerDetected(hand, data) {
        hand.fingers.forEach(function (finger) {
            var fingerName = finger.GetFingerLabel();
            var gestureName = side + 'Hand' + fingerName + 'FingerExtended'

            if (finger.extended) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        Input: data,
                        Hand: hand,
                        GestureInformation: gestureInformation,
                        Finger: finger.type,
                    }
                });
            }
            else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        });
    }; // END {Side} Hand {Finger} 

    /*
    Name:           {Side} Hand Flexion Detected

    Outputs:        RightHandFlexion
                    LeftHandFlexion
*/
    function SideHandFlexionDetected(hand, data) {
        var gestureName = side + 'HandFlexion'
        if (hand.IsFlexed()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (gestureInformation.FireCount > 10) {
                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        Input: data,
                        Hand: hand,
                        GestureInformation: gestureInformation
                    }
                });
            }
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Flexion

    /*
    Name:           {Side} Hand Extension Detected

    Outputs:        RightHandExtension
                    LeftHandExtension
*/
    function SideHandExtensionDetected(hand, data) {
        var gestureName = side + 'HandExtension'
        if (hand.IsExtended()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (gestureInformation.FireCount > 10) {
                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        Input: data,
                        Hand: hand,
                        GestureInformation: gestureInformation
                    }
                });
            }
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Extension

    /*
    Name:           {Side} Hand Radial Deviation

    Outputs:        RightHandRadialDeviation
                    LeftHandRadialDeviation
*/
    function SideHandRadialDeviation(hand, data) {
        var gestureName = side + 'HandRadialDeviation'
        if (hand.IsRadialDeviated()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Radial Deviation

    /*
           Name:           {Side} Hand Ulnar Deviation

           Outputs:        RightHandUlnarDeviation
                           LeftHandUlnarDeviation
       */
    function SideHandUlnarDeviation(hand, data) {
        var gestureName = side + 'HandUlnarDeviation';
        if (hand.IsUlnarDeviated()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Ulnar Deviation

    /*
            Name:           {Side} Hand Supenation

            Outputs:        RightHandSupenation
                            LeftHandSupenation
        */
    function SideHandSupenation(hand, data) {
        var gestureName = side + 'HandSupenation'
        if (hand.IsSupine()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Supenation

    /*
            Name:           {Side} Hand Pronation

            Outputs:        RightHandPronation
                            LeftHandPronation
        */
    function SideHandPronation(hand, data) {
        var gestureName = side + 'HandPronation'
        if (hand.IsProne()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);
            
            if (!gestureInformation.StartPosition) {
                gestureInformation.StartPosition = hand.palmPosition;
            }

            if (!gestureInformation.StartHand) {
                gestureInformation.StartHand = hand;
            }

            gestureInformation.EndPosition = hand.palmPosition;

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Pronation

    /*
           Name:           {Side} Hand Hyper Pronation

           Outputs:        RightHandHyperRotated
                           LeftHandHyperRotated
       */
    function SideHandHyperRotated(hand, data) {
        var gestureName = side + 'HandHyperRotated'
        if (hand.IsHyperRotated()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Hyper Pronation

    /*
           Name:           {Side} Hand Neutral

           Outputs:        RightHandNeutral
                           LeftHandNeutral
        */
    function SideHandNeutral(hand, data) {
        var gestureName = side + 'HandNeutral';
        if (hand.IsNeutral()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Neutral

    function SideHandFlexAndRotation(hand, data) {
        var rotation = hand.IsSupine() ? 'Supine' : hand.IsNeutral() ? 'Neutral' : hand.IsProne() ? 'Prone' : 'Hyperrotated';
        var flex = hand.IsFlexed() ? 'Flexed' : hand.IsExtended() ? 'Extended' : 'Neutral';
        var gestureName = side + 'Hand' + flex + 'And' + rotation;

        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side, "Combined");
        ActiveGesturesDictionary.DeleteAllBut(trackingType, gestureName, dictionary, side, "Combined")

        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: gestureName,
            source: source,
            data: {
                Input: data,
                Hand: hand,
                GestureInformation: gestureInformation
            }
        });
    }

    function Pinch(hand, data) {
        for (var i = 0; i < hand.fingers.length - 1; i++) {
            for (var j = i + 1; j < hand.fingers.length; j++) {
                var gestureName = side + 'Hand' + hand.fingers[i].GetFingerLabel() + hand.fingers[j].GetFingerLabel() + 'Pinch';
                var pinchDistance = hand.fingers[i].DistanceToFinger(hand.fingers[j]);

                if (pinchDistance < 23) {
                    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);
                    gestureInformation.PinchFingersIndicies = [i, j];
                    gestureInformation.PinchDistance = pinchDistance;
                    gestureInformation.PinchMidpoint = math.MidpointBetweenTwoPoints(hand.fingers[i].tipPosition, hand.fingers[j].tipPosition)

					gestureInformation.axis = hand.rotationAxis(hand.frame);
					gestureInformation.degree = hand.rotationAngle(hand.frame, gestureInformation.axis);

                    bus.publish({
                        channel: "Input.Processed.Efficio",
                        topic: gestureName,
                        source: source,
                        data: {
                            Input: data,
                            Hand: hand,
                            GestureInformation: gestureInformation
                        }
                    });
                }
                else {
                    ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
                }
            }
        }
    };// END Pinch

    function ThumbsUp(hand, data) {
        var gestureName = side + 'ThumbsUp';
        if (hand.IsNeutral() && hand.AreRequisiteFingersExtended([0])) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    input: data,
                    hand: hand,
                    gestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END ThumbsUp

    /*
        Name:           {Side} Hand Airplane

        Outputs:        RightHandAirplane
                        LeftHandAirplane
    */
    function Airplane( hand, data )
    {
        var gestureName = side + "HandAirplane";
        var fingerAdjacencyAngleThreshold = 30;

        // All fingers extended
        var handIsAirplane = hand.AreRequisiteFingersExtended([0, 1, 2, 3, 4]);

        // Index and middle touching
        handIsAirplane = handIsAirplane && hand.indexFinger.AngleToFinger(hand.middleFinger) < fingerAdjacencyAngleThreshold;

        // Middle and ring touching
        handIsAirplane = handIsAirplane && hand.middleFinger.AngleToFinger(hand.ringFinger) < fingerAdjacencyAngleThreshold;

        // Thumb and index separated
        handIsAirplane = handIsAirplane && hand.thumb.AngleToFinger(hand.indexFinger) > fingerAdjacencyAngleThreshold;

        // Ring and pinky separated
        handIsAirplane = handIsAirplane && hand.ringFinger.AngleToFinger(hand.pinky) > fingerAdjacencyAngleThreshold;


        if ( handIsAirplane )
        {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry( trackingType, gestureName, dictionary, side );

            if (!gestureInformation.StartPosition )
            {
                gestureInformation.StartPosition = hand.palmPosition;
            }

            if (!gestureInformation.StartHand )
            {
                gestureInformation.StartHand = hand;
            }

            gestureInformation.EndPosition = hand.palmPosition;

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
                }
            });
        }
        else
        {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    }// END Hand Airplane

    function ProcessInput(data, hand) {
        // Hand information
        (function HandInformation() {
            side = hand.GetSide();
        })();

        if (!oneHandPositionDetector) {
            oneHandPositionDetector = {
                Name: name,
                Positions: {
                    SideHandDetected: SideHandDetected,
                    SideHandCountFingersExtended: SideHandCountFingersExtended,
                    SideHandFingerDetected: SideHandFingerDetected,
                    SideHandFlexionDetected: SideHandFlexionDetected,
                    SideHandExtensionDetected: SideHandExtensionDetected,
                    SideHandRadialDeviation: SideHandRadialDeviation,
                    SideHandUlnarDeviation: SideHandUlnarDeviation,
                    SideHandSupenation: SideHandSupenation,
                    SideHandPronation: SideHandPronation,
                    SideHandHyperRotated: SideHandHyperRotated,
                    SideHandNeutral: SideHandNeutral,
                    SideHandFlexAndRotation: SideHandFlexAndRotation,
                    Pinch: Pinch,
                    ThumbsUp: ThumbsUp,
                    Airplane: Airplane
                }
            }
        }

        for (position in oneHandPositionDetector.Positions) {
            oneHandPositionDetector.Positions[position](hand, data);
        }

        return oneHandPositionDetector;
    }

    return {
        ProcessInput: ProcessInput
    }
});

﻿define('Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandGestureDetection',['postal', 'Helpers/Math'], function (bus, math) {
    var source = 'Efficio Gesture Grimoire';
    var name = 'One Hand Gesture Detector';
    var dictionary = 'OneHandGesture';
    var trackingType = 'Hands';
    var side;
    var oneHandGestureDetector;
    var ActiveGesturesDictionary = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary;

    function SideHandSwipe(hand, data) {
        var gestureName = side + 'HandSwipe';
        var isExecuting = false;
        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

        if (hand.IsExtended() && hand.IsNeutral()) {
            if (typeof gestureInformation.ExtensionFramesCount === 'undefined') {
                gestureInformation.ExtensionFramesCount = 0;
                gestureInformation.PalmStartPosition = hand.palmPosition;
                gestureInformation.MiddleFingerStartPosition = hand.middleFinger.tipPosition;
                gestureInformation.StartFrame = hand.frame;

                setTimeout(function () {
                    isExecuting = false;
                }, 2000);
            } else {
                gestureInformation.ExtensionFramesCount++;
            }

            isExecuting = true;
        } else {
            if (gestureInformation.ExtensionFramesCount > 10 && hand.IsNeutral()) {
                if (typeof gestureInformation.NeutralFramesCount === 'undefined') {
                    gestureInformation.NeutralFramesCount = 0;
                } else {
                    gestureInformation.NeutralFramesCount++;
                }

                isExecuting = true;
            }
        }

        if (gestureInformation.ExtensionFramesCount > 10 && gestureInformation.NeutralFramesCount > 10 && hand.IsFlexed() && !gestureInformation.Fired) {
            gestureInformation.EndTime = new Date();
            gestureInformation.PalmEndPosition = hand.palmPosition;
            gestureInformation.MiddleFingerEndPosition = hand.middleFinger.tipPosition;
            gestureInformation.EndFrame = hand.frame;
            gestureInformation.SwipeVelocity = math.Velocity(gestureInformation.MiddleFingerStartPosition, gestureInformation.MiddleFingerEndPosition, gestureInformation.GestureDuration());
            gestureInformation.Fired = true;

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
                }
            });

            setTimeout(function () {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }, 250);
        }

        if (!isExecuting) {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    }

    function ProcessInput(data, hand) {
        // Hand information
        (function HandInformation() {
            side = hand.GetSide();
        })();


        if (!oneHandGestureDetector) {
            oneHandGestureDetector = {
                Name: name,
                Gestures: {
                    SideHandSwipe: SideHandSwipe
                }
            }
        }

        for (gesture in oneHandGestureDetector.Gestures) {
            oneHandGestureDetector.Gestures[gesture](hand, data);
        }

        return oneHandGestureDetector;
    }

    return {
        ProcessInput: ProcessInput
    }
});

﻿define('Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/Two Hand Gestures/TwoHandPositionDetection',['postal', 'Helpers/Math'], function (bus, math) {
    var source = 'Efficio Gesture Grimoire';
    var dictionary = 'TwoHandPosition';
    var trackingType = 'Hands';
    var twoHandsGestureDetector;
    var ActiveGesturesDictionary = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary;

    function BothHandsNeutral(data) {
        var hands = data.Hands;
        var gestureName = 'BothHandsNeutral'

        if (hands[0].IsNeutral() && hands[1].IsNeutral()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary);

            gestureInformation.Distance = math.DistanceBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);
            gestureInformation.DistanceX = math.DistanceBetweenTwoPoints(hands[0].palmPosition[0], hands[1].palmPosition[0]);
            gestureInformation.DistanceY = math.DistanceBetweenTwoPoints(hands[0].palmPosition[1], hands[1].palmPosition[1]);
            gestureInformation.DistanceZ = math.DistanceBetweenTwoPoints(hands[0].palmPosition[2], hands[1].palmPosition[2]);
            gestureInformation.Midpoint = math.MidpointBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hands: hands,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary);
        }
    };// END Both Hands Neutral

    function BothHandsPronation(data) {
        var hands = data.Hands;
        var gestureName = 'BothHandsPronation'

        if (hands[0].IsProne() && hands[1].IsProne()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary);

            gestureInformation.Distance = math.DistanceBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);
            gestureInformation.DistanceX = math.DistanceBetweenTwoPoints(hands[0].palmPosition[0], hands[1].palmPosition[0]);
            gestureInformation.DistanceY = math.DistanceBetweenTwoPoints(hands[0].palmPosition[1], hands[1].palmPosition[1]);
            gestureInformation.DistanceZ = math.DistanceBetweenTwoPoints(hands[0].palmPosition[2], hands[1].palmPosition[2]);
            gestureInformation.Midpoint = math.MidpointBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hands: hands,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary);
        }
    };// END Both Hand Pronation

    function ProcessInput(data) {

        if (!twoHandsGestureDetector) {
            twoHandsGestureDetector = {
                Name: name,
                Gestures: {
                    BothHandsNeutral: BothHandsNeutral,
                    BothHandsPronation: BothHandsPronation
                }
            };
        }


        for (gesture in twoHandsGestureDetector.Gestures) {
            twoHandsGestureDetector.Gestures[gesture](data);
        }

        return twoHandsGestureDetector;
    }

    return {
        ProcessInput: ProcessInput
    }
});

﻿define('Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/HandGestureDetectionHandler',['postal'], function (bus) {
    var source = 'Efficio Gesture Grimoire';
    var name = 'Efficio Hand Gesture Detection Handler';
    var channel = 'Input.Processed.Efficio';
    var trackingType = "Hands";
    var handGestureDetectionLibrary = { Name: name };
    var ActiveGesturesDictionary = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary;

    function ProcessInput(data) {
        // Check if there is any input and if the input contains hands
        if (data.Hands) {

            var hands = data.Hands;

            // Check if any hands are present
            (function NoHandsDetected() {
                var gestureName = 'NoHandsDetected'

                if (hands.length === 0) {
                    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName)

                    bus.publish({
                        channel: channel,
                        topic: gestureName,
                        source: source,
                        data: {
                            message: 'No hands detected',
                            gestureInformation: gestureInformation
                        }
                    });

                    // Clear gesture dictionary for one and two hand gestures
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandPosition');
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandGesture');
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandPositions');
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandGestures');

                    // No need for processing any further
                    return;
                }
                else {
                    ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName);
                }
            })();

            // Detects each hand's presence independently
            if (hands.length > 0) {
                hands.forEach(function (hand) {
                    var type = hand.GetSide();
                    var gestureName = type + 'HandDetected';

                    // Send Message saying what hand was detected
                    bus.publish({
                        channel: channel,
                        topic: gestureName,
                        source: source,
                        data: {
                            hand: hand
                        }
                    });

                    // Send data to the one hand position gesture detection libraries
                    require(['Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandPositionDetection'], function (ohgd) {
                        handGestureDetectionLibrary.OneHandPositionDetector = ohgd.ProcessInput(data, hand);
                    });

                    // Send data to the one hand gesture detection library
                    require(['Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandGestureDetection'], function (ohgd) {
                        handGestureDetectionLibrary.OneHandGestureDetector = ohgd.ProcessInput(data, hand);
                    });
                });
            }

            // Check if one hand is present
            (function OneHandDetected() {
                var gestureName = 'OneHandDetected';

                if (hands.length === 1) {
                    var hand = hands[0];
                    var side = hand.GetSide();
                    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName)

                    var oppositeHand = side === 'Right' ? 'Left' : 'Right'

                    // Clear other hand gesture dictionary entries
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandPosition', oppositeHand);
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandGesture', oppositeHand);

                    // Clear two hand gesture dictionary entries
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandPositions');
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandGestures');

                    // Send Message saying that a hand was detected
                    bus.publish({
                        channel: channel,
                        topic: gestureName,
                        source: source,
                        data: {
                            handCount: hands[0],
                            gestureInformation: gestureInformation
                        }
                    });
                }
                else {
                    ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName);
                }
            })();

            // Check if any hand present
            if (hands.length == 2) {
                (function TwoHandsDetected() {
                    var gestureName = 'TwoHandDetected'

                    if (hands.length === 2) {
                        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName)

                        // Send Message saying that two hands were detected
                        bus.publish({
                            channel: channel,
                            topic: gestureName,
                            source: source,
                            data: {
                                gestureInformation: gestureInformation
                            }
                        });

                        // Send data to the two hand gesture detection library
                        require(['Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/Two Hand Gestures/TwoHandPositionDetection'], function (thgd) {
                            handGestureDetectionLibrary.TwoHandPositionDetector = thgd.ProcessInput(data);
                        });
                    }
                    else {
                        ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName);
                    }
                })();
            }
        }

        return handGestureDetectionLibrary;
    }

    return {
        ProcessInput: ProcessInput
    }
})
;
﻿define('Input Recognition and Processing/Human Input Recognition and Processing/Body Positions/BodyPositionDetectionHandler',['postal'], function (bus) {

    var source = 'Efficio Gesture Grimoire';
    var channel = 'Input.Processed.Efficio';
    var dictionary = 'BodyPosition';
    var trackingType = 'Body';
    var side;
    var ActiveGesturesDictionary;

    var bodyPositionDetector;
    var name = "Body Position Detector";

    var joint1; // right wrist
    var joint2; // left wrist
    var joint3; // head

    function RightWristAheadOfLeftWrist() {
        var gestureName = "RightWristAheadOfLeftWrist";
        if (AreJointsTracked(joint1, joint2)) {
            if (joint1.IsForwardOf(joint2)) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist ahead of left wrist detected',
                        gestureInformation: gestureInformation
                    }
                });
            } else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        }
    };// END RightWristAheadOfLeftWrist

    function RightWristBehindOfLeftWrist() {
        var gestureName = "RightWristBehindLeftWrist";
        if (AreJointsTracked(joint1, joint2)) {
            if (joint1.IsBehindOf(joint2)) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist behind left wrist detected',
                        gestureInformation: gestureInformation
                    }
                });
            } else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        }
    };// END RightWristBehindLeftWrist

    function RightWristAboveHead() {
        var gestureName = "RightWristAboveHead";
        if (AreJointsTracked(joint1, joint3)) {
            if (joint1.IsAboveOf(joint3)) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist above head detected',
                        gestureInformation: gestureInformation
                    }
                });
            } else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        }
    };// END RightWristAboveHead

    function LeftWristAboveHead() {
        var gestureName = "LeftWristAboveHead";
        if (AreJointsTracked(joint2, joint3)) {
            if (joint2.IsAboveOf(joint3)) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Left wrist above head detected',
                        gestureInformation: gestureInformation
                    }
                });
            } else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        }
    };// END LeftWristAboveHead

    function GetJoints(data) {
        data.input.forEach(function (jointFriendly) {

            // Get the joints we are using to identify navigation
            if (jointFriendly.JointName == "WristRight") {
                joint1 = jointFriendly;
            }

            if (jointFriendly.JointName == "WristLeft") {
                joint2 = jointFriendly;
            }

            if (jointFriendly.JointName == "Head") {
                joint3 = jointFriendly;
            }

        });
    }// END GetJoints

    function AreJointsTracked(joint1, joint2) {
        return joint1.IsTracked && joint2.IsTracked;
    }

    function ProcessInput(data, agd) {

        ActiveGesturesDictionary = agd;
        GetJoints(data);

        if (!bodyPositionDetector) {
            bodyPositionDetector = {
                Name: name,
                TrackingType: trackingType,
                Dictionary: dictionary,
                SubDictionary1: side,
                Positions: {
                    //RightWristAheadOfLeftWrist: RightWristAheadOfLeftWrist,  // Not In Use for Demo on 12/7/15
                    //RightWristBehindOfLeftWrist: RightWristBehindOfLeftWrist,
                    RightWristAboveHead: RightWristAboveHead,
                    LeftWristAboveHead: LeftWristAboveHead,
                }
            }
        }

        for (var position in bodyPositionDetector.Positions) {
            bodyPositionDetector.Positions[position]();
        }

        return bodyPositionDetector;

    }


    return {
        ProcessInput: ProcessInput
    }
})
;
﻿define('Input Recognition and Processing/Human Input Recognition and Processing/EfficioGestureGrimoire',['postal'], function (bus) {
    var source = 'Efficio Gesture Grimoire';
    var efficioGestureGrimoire = { Name: source };

    function DetectPredefinedGestures(data, envelope) {
        var trackingType = data.TrackingType || '';

        switch (trackingType) {
            case 'Hands': {
                require(['Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/HandGestureDetectionHandler'], function (hgdh) {
                    efficioGestureGrimoire.HandProcessor = hgdh.ProcessInput(data)
                });
                break;
            }
            case 'Body': {
                // Body tracking library here
                require(['Input Recognition and Processing/Human Input Recognition and Processing/Body Positions/BodyPositionDetectionHandler'], function (bpdh) {
                    bpdh.ProcessInput(data)
                });
                break;
            }
            case 'Head': {
                // Head tracking library here
                break;
            }
            case 'Brain': {
                // Brain tracking library here
                break;
            }
            case 'Sensor': {
                // Other sensory input library here
                break;
            }
        }
    }

    return {
        Initialize: function () {
            return efficioGestureGrimoire;
        },

        ProcessInput: function (data, envelope) {
            DetectPredefinedGestures(data, envelope);
        }
    }
});

﻿define('Input Recognition and Processing/Human Input Recognition and Processing/HumanInputRecognitionAndProcessing',['postal'], function (bus) {

    var hipr = { PrototypeExtensions: {}, };

    function Initialize(EfficioConfiguration) {
        // Extend input models for easier processing and to make them more informative

        if (Efficio.Configuration.Devices.LeapMotion) {
            (function LeapMotionPrototypeExtensions() {
                hipr.PrototypeExtensions.LeapMotion = {};

                require(['Input Recognition and Processing/Human Input Recognition and Processing/Input Extensions/LeapMotion/HandExtensions'], function (handExtensions) {
                    hipr.PrototypeExtensions.LeapMotion.Hand = handExtensions.ExtendClasses();
                });

                require(['Input Recognition and Processing/Human Input Recognition and Processing/Input Extensions/LeapMotion/FingerExtensions'], function (fingerExtensions) {
                    hipr.PrototypeExtensions.LeapMotion.Finger = fingerExtensions.ExtendClasses();
                });
            })();
        }

        if (Efficio.Configuration.Devices.RealSense) {
            (function RealSensePrototypeExtensions() {
                hipr.PrototypeExtensions.RealSense = {};

                require(['Input Recognition and Processing/Human Input Recognition and Processing/Input Extensions/Intel/RealSense/HandExtensions'], function (handExtensions) {
                    hipr.PrototypeExtensions.RealSense.Hand = handExtensions.ExtendClasses();
                });
            })();
        }

        require(['Input Recognition and Processing/Human Input Recognition and Processing/CustomGestureLibrariesAccess'], function (customGestureLibraries) {
            hipr.CustomGestureLibrary = customGestureLibraries.Initialize();

            bus.subscribe({
                channel: "Input.Raw.Human",
                topic: "*",
                callback: function (data, envelope) {
                    customGestureLibraries.ProcessInput(data, envelope);
                }
            });
        }), function (err) {
            bus.publish({
                channel: 'UserNotification',
                topic: 'Warn',
                source: source,
                data: {
                    message: 'No custom gesture library configured'
                }
            });
        };

        require(['Input Recognition and Processing/Human Input Recognition and Processing/EfficioGestureGrimoire'], function (efficioGestureGrimoire) {
            hipr.EfficioGestureGrimoire = efficioGestureGrimoire.Initialize();

            bus.subscribe({
                channel: "Input.Raw.Human",
                topic: "*",
                callback: function (data, envelope) {
                    efficioGestureGrimoire.ProcessInput(data, envelope);
                }
            });
        });

        return hipr;
    }

    return {
        Initialize: Initialize
    }
});

﻿define('Input Recognition and Processing/Device Input Recognition and Processing/CustomDeviceLibrary',['postal'], function (bus) {
    var source = 'Custom Device Library';
    var ActiveGesturesDictionaryCopy = {};

    function LoadCustomGestures() {
        // Custom Gestures created by the user will be loaded here
    }

    function DetectCustomGestures(data, envelope) {
        var libraryName = 'custom library 1';
        var gestureName = 'my custom gesture';
        var gestureData = 'my custom gesture data';

        // If custom gesture is detected
        if (data.input === 'BVH representation of a custom gesture') {

            bus.publish({
                channel: "Input.Processed.Custom." + libraryName,
                topic: gestureName,
                source: source,
                data: gestureData
            });
        }
    }

    return {
        Initialize: function () {
        },
        ProcessInput: function (data, envelope) {

            // Where input is processed and Custom Gestures are published on the channel
            DetectCustomGestures(data, envelope);
        }
    }
})
;
﻿define('Input Recognition and Processing/Device Input Recognition and Processing/Orientation/Orientation',['postal'], function (bus) {

    var source = 'Efficio Device Grimoire';
    var channel = 'Input.Processed.Efficio.Device';
    var dictionary = 'Device';
    var trackingType = 'Orientation';
    var orientationProcessor;

    function RawOrientationData(data) {
        var gestureName = "RawOrientationData";
        var gestureInformation = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary)

        bus.publish({
            channel: channel,
            topic: gestureName,
            source: source,
            data: {
                Input: data,
                GestureInformation: gestureInformation
            }
        });
    };

        function ProcessInput(data) {

        if (!orientationProcessor) {
            orientationProcessor = {
                Name: name,
                TrackingType: trackingType,
                Dictionary: dictionary,
                Positions: {
                    RawOrientationData: RawOrientationData,
                }
            }
        }

        for (var position in orientationProcessor.Positions) {
            orientationProcessor.Positions[position](data);
        }

        return orientationProcessor;

    }


    return {
        ProcessInput: ProcessInput
    }
})
;
﻿define('Input Recognition and Processing/Device Input Recognition and Processing/EfficioDeviceGrimoire',['postal'], function (bus) {
    var source = 'Efficio Device Grimoire';
    var efficioGestureGrimoire = { Name: source };

    function DetectPredefinedGestures(data, envelope) {
        var trackingType = data.TrackingType || '';

        switch (trackingType) {
            case 'Orientation': {
                require(['Input Recognition and Processing/Device Input Recognition and Processing/Orientation/Orientation'], function (hgdh) {
                    efficioGestureGrimoire.HandProcessor = hgdh.ProcessInput(data)
                });
                break;
            }
        }
    }



    return {
        Initialize: function (agd) {
            return efficioGestureGrimoire;
        },

        ProcessInput: function (data, envelope) {
            DetectPredefinedGestures(data, envelope);
        }
    }
});

﻿define('Input Recognition and Processing/Device Input Recognition and Processing/DeviceInputRecognitionAndProcessing',['postal'], function (bus) {

    var dipr = { PrototypeExtensions: {}, };

    function Initialize(EfficioConfiguration) {
        // Extend input models for easier processing and to make them more informative

        require(['Input Recognition and Processing/Device Input Recognition and Processing/CustomDeviceLibrary'], function (customGestureLibraries) {
            dipr.CustomGestureLibrary = customGestureLibraries.Initialize();

            bus.subscribe({
                channel: "Input.Raw.Device",
                topic: "*",
                callback: function (data, envelope) {
                    customGestureLibraries.ProcessInput(data, envelope);
                }
            });
        }), function (err) {
            bus.publish({
                channel: 'UserNotification',
                topic: 'Warn',
                source: source,
                data: {
                    message: 'No custom gesture library configured'
                }
            });
        };

        require(['Input Recognition and Processing/Device Input Recognition and Processing/EfficioDeviceGrimoire'], function (efficioGestureLibrary) {
            dipr.EfficioGestureLibrary = efficioGestureLibrary.Initialize();

            bus.subscribe({
                channel: "Input.Raw.Device",
                topic: "*",
                callback: function (data, envelope) {
                    efficioGestureLibrary.ProcessInput(data, envelope);
                }
            });
        });

        return dipr;
    }

    return {
        Initialize: Initialize
    }
});

﻿define('Input Recognition and Processing/InputRecognitionAndProcessing',['postal', 'Input Recognition and Processing/ActiveGestureDictionary'], function (bus, agd) {

    var ipr = { ActiveGesturesDictionary: agd, PrototypeExtensions: {}, };

    function Initialize() {

        require(['Input Recognition and Processing/Human Input Recognition and Processing/HumanInputRecognitionAndProcessing'], function (humanInputRecognitionAndProcessing) {
            ipr.HumanInputRecognitionAndProcessing = humanInputRecognitionAndProcessing.Initialize();
        }), function (err) {
            bus.publish({
                channel: 'UserNotification',
                topic: 'Warn',
                source: source,
                data: {
                    message: 'No custom gesture library configured'
                }
            });
        };

        require(['Input Recognition and Processing/Device Input Recognition and Processing/DeviceInputRecognitionAndProcessing'], function (deviceInputRecognitionAndProcessing) {
            ipr.DeviceInputRecognitionAndProcessing = deviceInputRecognitionAndProcessing.Initialize();
        }), function (err) {
            bus.publish({
                channel: 'UserNotification',
                topic: 'Warn',
                source: source,
                data: {
                    message: 'No custom gesture library configured'
                }
            });
        };

        return ipr;
    }

    return {
        Initialize: Initialize
    }
});

﻿define('InternalScene',['three'], function () {
    var scene = new THREE.Scene();

    return {
        Initialize: function () {
            return {
                Scene: scene
            }
        }
    }
});

﻿define('Asset Management and Inventory/AssetManager',['postal', 'InternalScene'], function (bus, internalScene) {
    var source = "Efficio Asset Manager"

    function CreateAsset(asset) {
        bus.publish({
            channel: "UserNotification",
            topic: "AssetCreated",
            source: source,
            data: {
                message: "Asset created with data: " + asset
            }
        });

        internalScene.Scene.add(asset);
    };

    function CreateAssets(assets) {

    };

    function RetrieveAsset(assetID) {

    };

    function RetrieveAssets(assetIDs) {

    };

    function RetrieveAllAssets() {

    };

    function RetrieveAllAssetIDs() {

    };

    function UpdateAsset(asset) {
        var oldAsset = internalScene.Scene.getObjectById(asset.id);

        internalScene.Scene.remove(oldAsset);
        internalScene.Scene.add(asset);

        asset = internalScene.Scene.getObjectById(asset.id);

        bus.publish({
            channel: "UserNotification",
            topic: "AssetUpdated",
            source: source,
            data: {
                message: source + " - Asset Updated: \nID: " + asset.id + "\nPosition: (" + asset.position.x + " , " + asset.position.y + ", " + asset.position.z + ")" + "\nScale: (" + asset.scale.x + " , " + asset.scale.y + ", " + asset.scale.z + ")"
            }
        });
    };

    function UpdateAssets(assets) {

    };

    function DeleteAsset(assetID) {

    };

    function DeleteAssets(assetIDs) {

    };

    function DeleteAllAssets() {

    };

    function GetValueForProperty(property, data) {
        switch (property) {
            case "ClosestAsset":
                {
                    return GetClosestAsset(data);
                }
        }
    }

    function GetClosestAsset(data) {
        if (data.location === null) {
            bus.publish({
                channel: "Exception.Efficio",
                topic: "GetClosestAsset",
                source: source,
                data: {
                    message: "GetClosestAsset function requires location argument"
                }
            });
        }
        return "Asset closest to point (" + data.Location.x + ", " + data.Location.y + ", " + data.Location.z + ")"
    }

    return {
        Initialize: function () {
            if (typeof window != 'undefined') {
                //var http = new XMLHttpRequest();
                //http.open('HEAD', '/debug.html', false);
                //http.send();

                //if (http.status != 404) {
                //    var params = [
                //        'height=' + screen.height,
                //        'width=' + screen.width,
                //        'fullscreen=yes' // only works in IE, but here for completeness
                //    ].join(',');

                //    window.open('/debug.html', 'AMI Debugger', params);
                //}
            }
        },

        CreateAsset: CreateAsset,

        CreateAssets: CreateAssets,

        RetrieveAsset: RetrieveAsset,

        RetrieveAssets: RetrieveAssets,

        RetrieveAllAssets: RetrieveAllAssets,

        RetrieveAllAssetIDs: RetrieveAllAssetIDs,

        UpdateAsset: UpdateAsset,

        UpdateAssets: UpdateAssets,

        DeleteAsset: DeleteAsset,

        DeleteAssets: DeleteAssets,

        DeleteAllAssets: DeleteAllAssets,

        GetValueForProperty: GetValueForProperty,

    }
});

﻿define('Constraints Engine/ConstraintsEngine',['postal', 'Asset Management and Inventory/AssetManager'], function (bus, ami) {
    var source = "Efficio Constraints Engine";
    var violated = false;

    var subscriptions = new Array();

    function RegisterSubscriber(subscription) {
        subscriptions.push(subscription);
    }

    function CheckConstraints(data) {
        //if (violated) {
        //    console.log('Constraints violated, changes not reflected internally.')
        //}
        //else {
        //    console.log('Constraints not violated, changes reflected internally.')
        //}

        return true;
    }

    return{
        Initialize: function () {

        }
    };
});

﻿define('Utils/GuidGenerator',[], function () {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    function NewGuid() {
        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    }

    return {
        NewGuid: NewGuid
    }
});

﻿define('Command Issuance and Control/CommandIssuanceAndControl',['postal', 'Asset Management and Inventory/AssetManager', 'Utils/GuidGenerator'], function (bus, ami, guidGenerator) {
    function AddMapping(channel, topic, action, executionPrerquisite, fireRestrictions) {
        AddActionMapping({
            Source: channel,
            Topic: topic,
            UUID: guidGenerator.NewGuid(),
            Action: action,
            ExecutionPrerequisite: executionPrerquisite,
            FireRestrictions: fireRestrictions
        });
    }

    function RemoveMapping(uuid) {
        bus.unsubscribeFor({ uuid: uuid });
    }

    function AddActionMapping(mapping) {
        if (!mapping.UUID) {
            mapping.UUID = guidGenerator.NewGuid();
        }

        var subscription =
            bus.subscribe({
                channel: mapping.Source,
                topic: mapping.Topic,
                callback: function (data, envelope) {
                    if (!data) {
                        data = {};
                    }

                    data.Message = {
                        Channel: envelope.channel,
                        Topic: envelope.topic,
                        Source: envelope.source,
                        SubscriptionUUID: mapping.UUID
                    }

                    var func = mapping.Action;

                    if (typeof func != 'function') {
                        func = getBridge(a2fm.Bridge)[mapping.Action];
                    }

                    // Get method parameters
                    var functionParameters = GetParamNames(func);

                    var argMapping = {};

                    // Create args for function call
                    var args = [];

                    if (mapping.Arguments) {
                        functionParameters.forEach(function (param) {
                            var params = mapping.Arguments.filter(function (argument) {
                                return argument.MapTo === param;
                            });

                            if (params.length > 0) {
                                var value;

                                if (params[0].Source && params[0].Source === 'AssetManager') {
                                    value = ami.GetValueForProperty(params[0].Name, data);
                                }
                                else {
                                    value = data[params[0].Name];
                                }

                                args.push(value);
                            }
                            else {
                                args.push(null);
                            }
                        });

                        args[args.length] = data;
                    }
                    else {
                        args = [data];
                    }

                    if (!data.GestureInformation) {
                        data.GestureInformation = {};
                    }

                    if (!data.GestureInformation[mapping.UUID]) {
                        data.GestureInformation[mapping.UUID] = {};
                    }

                    if (mapping.FireRestrictions) {
                        var execute = [];
                        var restrictions = mapping.FireRestrictions;
                        if (restrictions.FireOnce) {

                            if (data.GestureInformation[mapping.UUID].Fired) {
                                return;
                            }
                        }

                        if (restrictions.FireAfterXFrames) {
                            if (data.GestureInformation[mapping.UUID].FireCount < restrictions.FireAfterXFrames) {
                                return;
                            }
                        }
                    }

                    if (mapping.ExecutionPrerequisite) {
                        var prereq = mapping.ExecutionPrerequisite;

                        if (typeof mapping.ExecutionPrerequisite != 'function') {
                            prereq = getBridge(a2fm.Bridge)[mapping.ExecutionPrerequisite];
                        }

                        if (!prereq()) {
                            return;
                        }
                    }

                    func.apply(null, args);

                    if (data.GestureInformation[mapping.UUID]) {
                        data.GestureInformation[mapping.UUID].Fired = true;
                    }
                }
            })
    }

    function GetParamNames(func) {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var ARGUMENT_NAMES = /([^\s,]+)/g;

        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    }

    return {
        Initialize: function () {
            var caic = { AddMapping: AddMapping, RemoveMapping: RemoveMapping };
            var a2fm = Efficio.Configuration.ActionToFunctionMapping || {};


            function getBridge(bridge) {
                if (typeof bridge === 'object') {
                    return bridge;
                }

                if (typeof bridge === 'string') {
                    if (window[bridge] && typeof window[bridge] === 'object') {
                        return window[bridge]
                    }
                }

                throw new Exception('No bridging class is provided');
            }

            a2fm.ActionMappings.forEach(AddActionMapping);

            return caic;
        }
    };
});

﻿define('Command Issuance and Control/EventManager',['postal'], function (bus) {
    var source = 'Event Manager';

    function RaiseEvent(eventSource, eventName, data) {
        bus.publish({
            channel: eventSource,
            topic: eventName,
            source: source,
            data: data
        });
    }

    return {
        Initialize: function () {
            return {
                RaiseEvent: RaiseEvent
            }
        }
    }
});

﻿define('Logging/SystemNotificationListener',['postal'], function (bus) {
    return {
        Initialize: function () {
            bus.subscribe({
                channel: "SystemNotification",
                topic: "*",
                callback: function (data, envelope) {
                    console.log(envelope.topic + ": " + data.message);
                }
            });
        }
    }
});

﻿define('Input/DeviceManager',['postal'], function (bus) {
    var Devices = {};

    function ConnectedDevices() {
        var connectedDevices = { Count: 0 };

        for (var prop in Devices.RegisteredDevices) {
            if (prop !== 'Count' && Devices.RegisteredDevices[prop].IsConnected()) {
                connectedDevices[prop] = Devices.RegisteredDevices[prop];
                connectedDevices.Count++;
            }
        }

        return connectedDevices;
    }

    function DisconnectedDevices() {
        var disconnectedDevices = { Count: 0 };

        for (var prop in Devices.RegisteredDevices) {
            if (prop !== 'Count' && !Devices.RegisteredDevices[prop].IsConnected()) {
                disconnectedDevices[prop] = Devices.RegisteredDevices[prop];
                disconnectedDevices.Count++;
            }
        }

        return disconnectedDevices;
    }

    function Ready() {
        var deviceConfig = Efficio.Configuration.Devices;

        if (typeof deviceConfig !== 'undefined') {
            var count = 0;

            for (var prop in deviceConfig) {
                if (prop !== 'Count') {
                    if (deviceConfig[prop]) {
                        count++;
                    }
                }
            }

            deviceConfig.Count = count;
        }

        return deviceConfig.Count === Devices.RegisteredDevices.Count;
    }

    function Add(name, device, isConnected) {
        if (!Devices.RegisteredDevices[name]) {
            Devices.RegisteredDevices.Count++;
        }

        Devices.RegisteredDevices[name] = device;

        // DEV: Check is for development purposes. Remove for prod
        if (typeof isConnected === 'undefined' ) {
            throw new Exception('IsConnected method is a required argument.');
        }

        // DEV: Check is for development purposes. Remove for prod
        if (typeof isConnected !== 'function') {
            throw new Exception('IsConnected method is required to be a function.');
        }

        // DEV: Check is for development purposes. Remove for prod
        if (!device.Name) {
            throw new Exception('Name property is required when registering device in the Device Manager.');
        }

        // DEV: Check is for development purposes. Remove for prod
        if (!device.Manufacturer) {
            throw new Exception('Name property is required when registering device in the Device Manager.');
        }

        Devices.RegisteredDevices[name].IsConnected = isConnected;

        bus.publish({
            channel: 'Devices',
            topic: 'Added',
            source: name,
            data: {
                Name: name,
                Device: device
            }
        });
    }

    function Remove(name) {
        delete Devices[name];

        bus.publish({
            channel: 'Devices',
            topic: 'Removed',
            source: name,
            data: {
                Name: name
            }
        });
    }

    function Initialize(Efficio) {
        Devices.RegisteredDevices = { Count: 0 };
        Devices.ConnectedDevices = ConnectedDevices;
        Devices.DisconnectedDevices = DisconnectedDevices;
        Devices.Ready = Ready;

        return Devices;
    }

    return {
        Add: Add,
        Remove: Remove,
        Initialize: Initialize,
        Devices: Devices
    }
});

﻿define('Metrics/Metrics',[],function () {
    var startTime;
    var framesSinceStart = 0;
    var Metrics = {};
    var myReq;

    function incrementFrames() {
        framesSinceStart++;
        myReq = requestAnimationFrame(incrementFrames);
    }

    function AverageFPS() {
        return framesSinceStart / (UpTime() / 1000);
    }

    function UpTime() {
        return new Date() - startTime;
    }

    function Ready() {
        return myReq != null;
    }

    function Initialize() {
        Metrics.AverageFPS = AverageFPS;
        Metrics.UpTime = UpTime;
        Metrics.Ready = Ready

        return Metrics;
    }

    function Start() {
        startTime = new Date();

        if (window) {
            requestAnimationFrame(incrementFrames);
        }
    }

    return {
        Initialize: Initialize,
        Start: Start
    }
});

﻿define('Input/LeapMotion/HelperFunctions',[], function () {

    function NormalizePoint(frame, point) {
        return frame.interactionBox.normalizePoint(point, true);
    }

    function MapPointToAppCoordinates(frame, point, minimums, maximums) {
        return MapNormalizedPointToAppCoordinates(NormalizePoint(frame, point), minimums, maximums);
    }

    function MapNormalizedPointToAppCoordinates(point, minimums, maximums) {
        minX = minimums[0];
        minY = minimums[1];
        minZ = minimums[2];
        maxX = maximums[0];
        maxY = maximums[1];
        maxZ = maximums[2];

        return [
            GetIntermeditatePoint(minX, maxX, point[0]),
            GetIntermeditatePoint(minY, maxY, point[1]),
            GetIntermeditatePoint(minZ, maxZ, point[2]),
        ]
    }

    function GetIntermeditatePoint(min, max, percent) {
        return min + ((max - min) * percent);
    }

    return {
        NormalizePoint: NormalizePoint,
        MapPointToAppCoordinates: MapPointToAppCoordinates,
        MapNormalizedPointToAppCoordinates: MapNormalizedPointToAppCoordinates
    }
})
;
﻿define('Input/LeapMotion/LeapMotion',['postal', 'leapjs', 'Input/DeviceManager', 'Input/LeapMotion/HelperFunctions'], function (bus, Leap, deviceManager, helper) {
    var source = 'LeapMotion';
    var trackingType = 'Hands';
    var controller;

    function configure(EfficioConfiguration) {
        var LeapConfiguration = EfficioConfiguration.Devices.LeapMotion;
        LeapConfiguration = {
            Host: LeapConfiguration.Host || 'localhost',
            Port: LeapConfiguration.Port || 6437,
            EnableGestures: LeapConfiguration.EnableGestures || false,
            FrameEventName: LeapConfiguration.FrameEventName || 'animationFrame',
            UseAllPlugins: LeapConfiguration.UseAllPlugins || false
        }

        return LeapConfiguration;
    }

    return {
        Initialize: function (LeapConfiguration) {

            // Load Configuration
            LeapConfiguration = configure(LeapConfiguration);

            // Create Controller
            controller = new Leap.Controller({
                host: LeapConfiguration.Host,
                port: LeapConfiguration.Port,
                enableGestures: LeapConfiguration.EnableGestures,
                frameEventName: LeapConfiguration.FrameEventName,
                useAllPlugins: LeapConfiguration.UseAllPlugins
            });

            // Register Leap Motion's native gesture recognition
            controller.on("gesture", function (gesture) {
                if (gesture.state == "stop") {
                    bus.publish({
                        channel: 'Input.Raw.Human',
                        topic: 'Gesture',
                        source: source,
                        data: {
                            Name: gesture.type,
                            Gesture: gesture
                        }
                    });
                }
            });

            controller.connect();

            var device = {
                Name: 'Leap Motion',
                Manufacturer: 'Leap',
                Device: controller,
                Helper: helper
            }

            // Add Leap Motion to Device Manager
            deviceManager.Add(source, device, function () {
                return controller.connected();
            });
        },

        Start: function () {

            // Listens for input from device
            controller.loop(function (frame) {
                if (frame.valid) {
                    bus.publish({
                        channel: 'Input.Raw.Human',
                        topic: 'Leap',
                        source: source,
                        data: {
                            TrackingType: trackingType,
                            Frame: frame,
                            Controller: controller,
                            Hands: frame.hands
                        }
                    });
                }
            });
        }
    }
});

﻿define('Input/Microsoft Kinect/JointHelper',[],function () {

    // Reference https://msdn.microsoft.com/en-us/library/microsoft.kinect.jointtype.aspx for joint numbering
    // Joints are entered into the array based on numerical order

    var joints = ["SpineBase", "SpineMid", "Neck", "Head", "ShoulderLeft", "ElbowLeft", "WristLeft", "HandLeft", "ShoulderRight", "ElbowRight", "WristRight", "HandRight", "HipLeft", "KneeLeft", "AnkleLeft", "FootLeft", "HipRight", "KneeRight", "AnkleRight", "FootRight", "SpineShoulder", "HandTipLeft", "ThumbLeft", "HandTipRight", "ThumbRight"];

    function GetJointName(jointNumber) {
        return joints[jointNumber];
    }

    var jointTrackingStatus = ["NotTracked", "Inferred", "Tracked"];

    function GetJointTrackingStatus(trackNumber) {
        return jointTrackingStatus[trackNumber];
    }

    return {
        GetJointName: GetJointName ,

        GetJointTrackingStatus:GetJointTrackingStatus
    }
})
;
﻿define('Input/Microsoft Kinect/Kinect',['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = 'Microsoft Kinect';
    var TrackingType = 'Body';
    var controller;
    var device = "Kinect";
    var jointHelper;
    var connected = false;

    function configure(KinectConfiguration) {
        KinectConfiguration = {
            Host: KinectConfiguration.Host || "ws://localhost:8181"
        }

        return KinectConfiguration;
    }

    return {
        Initialize: function () {

            // Retrieve Joint Helper
            require(['Input/Microsoft Kinect/JointHelper'], function (jh) {
                jointHelper = jh;
            });

            // Load Configuration
            KinectConfiguration = Efficio.Devce.Kinect;
            KinectConfiguration = configure(KinectConfiguration);

            // Create Controller
            controller = new WebSocket(KinectConfiguration.Host);

            // Sends message when controller is connected
            controller.onopen = function ()
            {
                console.log("Connection successful.");
                connected = true;

                var device = {
                    Name: 'Kinect',
                    Manufacturer: 'Microsoft',
                    Device: controller
                }

                // ISMAEL: Device connection notification has been migrated to the Device Manager. Use the leap motion input as an example on how to use it
                // Add WebSocket to Device Manager
                // TODO: See if device can return connection status
                deviceManager.Add(source, device, function () {
                    return connected;
                });                
            };

            // Connection closed.
            controller.onclose = function () {
                    console.log("Connection closed.");
                    connected = false;
            }
        },

        Start: function () {

            // Listens for input from device
            controller.onmessage = function (frame)
            {
                var kinectFriendly = [];
               
               var skeleton = JSON.parse(frame.data);
               skeleton.Joints.forEach(function (joint)
               {
                   // Get the Joint Type and Tracking Status
                   var jointType = jointHelper.GetJointName(joint.JointType);
                   var jointTracking = jointHelper.GetJointTrackingStatus(joint.TrackingState);
                   var jointFriendly = { JointType: jointType, TrackingState: jointTracking, Joint: joint };

                   kinectFriendly.push(jointFriendly);
               });

                // ISMAEL: Consider just extending the joint object. Eliminate the need for object copying.

               skeleton.Joints.forEach(function (joint) {
                   // Get the Joint Type and Tracking Status
                   joint.FriendlyName = jointHelper.GetJointName(joint.JointType);
                   joint.TrackingStatus = jointHelper.GetJointTrackingStatus(joint.TrackingState);
                   jointHelper.AddExtensions(joint);
               });

               // ISMAEL: Tell me if you think this would be a useful function to expose
               //skeleton.FindJointByFriendlyName = function (friendlyName) {
               //    var returnJoint = this.Joints.filter(function (value) {
               //        value.FriendlyName === friendlyName
               //    });

               //    if (returnJoint && returnJoint.lenght > 0) {
               //        return returnJoint[0];
               //    }

               //    return null;
               //}

                bus.publish
                ({
                    channel: 'Input.Raw.Human',
                    topic: device,
                    source: source,
                    data:
                    {
                        TrackingType: TrackingType,
                        input: kinectFriendly
                    }
                });
            };
        }
    }
});

﻿define('Input/Microphone/Microphone',['postal', 'annyang', 'Input/DeviceManager'], function (bus, annyang, deviceManager) {
    var source = 'Microphone';
    var connected = false;

    function Initialize(LeapConfiguration) {

        var device = {
            Name: 'Microphone',
            Manufacturer: 'Unknown',
            Device: annyang
        }

        if (annyang) {
            if (typeof ActionToFunctionMapping.AudioCommands != 'undefined') {
                // Add our commands to annyang
                annyang.addCommands(ActionToFunctionMapping.AudioCommands);
            }

            annyang.addCallback('start', function () {
                connected = true;
            });

            annyang.addCallback('end', function () {
                connected = false;
            });
        }
        
        // Add microphone to Device Manager
        deviceManager.Add(source, device, function () {
            return connected;
        });

    }

    function Start() {
        if (annyang) {
            annyang.start();
        }
    }

    return {
        Intitialize: Initialize,
        Start: Start
    }
});

﻿define('Input/XR3D/XR3D',['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = 'XR3D';
    var TrackingType = 'asdf';
    var controller;
    var device = "XR3D";

    function configure(XR3DConfiguration) {
        XR3DConfiguration = {
            Host: XR3DConfiguration.Host || "ws://localhost:8181"
        }

        return XR3DConfiguration;
    }

    function Initialize() {
        var XR3DConfiguration = Efficio.Devce.XR3D;
        // Load Configuration
        XR3DConfiguration = configure(XR3DConfiguration);

        // Create Controller
        controller = new WebSocket(XR3DConfiguration.Host);

        // Sends message when controller is connected
        controller.onopen = function () {
            console.log("Connection successful.");

            var device = {
                Name: 'XR3D',
                Manufacturer: 'XR3D',
                Device: controller
            }

            // TODO: See if device can return connection status
            deviceManager.Add(source, device, function () {
                return true;
            });
        };

        // Connection closed.
        controller.onclose = function () {
            console.log("Connection closed.");

        }
    }

    function Start() {

        // Listens for input from device
        controller.onmessage = function (frame) {
            var skeleton = JSON.parse(frame.data);

            bus.publish
               ({
                   channel: 'Input.Raw.Human',
                   topic: device,
                   source: source,
                   data:
                   {
                       TrackingType: TrackingType,
                       input: skeleton
                   }
               });
        }
    }

    return {
        Initialize: Initialize,
        Start: Start
    }
});

﻿define('Input/Intel/RealSense/Sense Type/Hands/Extensions/Alerts',['realsense'], function (realsense) {
    var alertLabelDictionary = {};

    function CreateDictionary() {
        var alertType = intel.realsense.hand.AlertType;
        for(var prop in alertType)
        {
            alertLabelDictionary[alertType[prop]] = prop;
        }
    }

    function GetNameForLabel(id) {
        return alertLabelDictionary[id];
    }

    function ExtendClasses() {
        CreateDictionary();

        var extensions = {
            GetNameForLabel: GetNameForLabel
        }

        for (var property in extensions) {
            intel.realsense.hand.AlertType[property] = extensions[property];
        }

        return extensions;
    }

    return {
        ExtendClasses: ExtendClasses
    }
})
;
﻿define('Input/Intel/RealSense/Sense Type/Hands/HandTracking',['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = 'Intel RealSense';
    var trackingType = 'Hands';
    var useNativeGestures = false;
    var connected = false;

    // TODO build out handTracking object for Efficio global object
    var handTracking = {};

    // On connected to device info
    function onConnect(sender, deviceConnected) {
        connected = deviceConnected;
    }

    // Error status
    function onStatus(sender, sts) {
        if (sts < 0) {
            status('Module error with status code: ' + sts);
            clear();
        }
    }

    // Process hand data when ready
    function onHandData(sender, data) {
        // retrieve hand data 
        var handData = data.queryHandData(intel.realsense.hand.AccessOrderType.ACCESS_ORDER_NEAR_TO_FAR);

        if (!handData) {
            handData = [];
        }

        bus.publish({
            channel: 'Input.Raw.Human',
            topic: 'RealSense',
            source: source,
            data: {
                TrackingType: trackingType,
                Input: data,
                Hands: handData
            }
        });

        var gestures = data.firedGestureData;
        if (gestures && gestures.length > 0) {
            gestures.forEach(function (gesture) {
                OnFiredGesture(gesture);
            });
        }

        var alerts = data.firedAlertData;
        if (alerts && alerts.length > 0) {
            // TODO convert to 'let' once migrated to 'use strict'
            var getNameForLabel = intel.realsense.hand.AlertType.GetNameForLabel;

            alerts.forEach(function (alert) {
                alert.name = getNameForLabel(alert.label);
                OnFiredAlert(alert);
            });
        }
    }


    function OnFiredAlert(alert) {
        bus.publish({
            channel: 'Input.Raw.Alerts',
            topic: alert.name,
            source: source,
            data: {
                TrackingType: trackingType,
                Alert: alert
            }
        });
    }

    function OnFiredGesture(gesture) {
        bus.publish({
            channel: 'Input.Raw.Gestures',
            topic: gesture.name,
            source: source,
            data: {
                TrackingType: trackingType,
                Gesture: gesture
            }
        });
    }

    function Start(sense, useGestures) {
        useNativeGestures = useGestures || false;

        // Extend model
        require(['Input/Intel/RealSense/Sense Type/Hands/Extensions/Alerts'], function (alertExtensions) {
            alertExtensions.ExtendClasses();
        })

        intel.realsense.hand.HandModule.activate(sense).then(function (result) {
            handModule = result;

            // Set the on connect handler
            sense.onDeviceConnected = onConnect;

            var device = {
                Name: 'RealSense',
                Manufacturer: 'Intel',
                Device: handModule
            }

            // Add Leap Motion to Device Manager
            deviceManager.Add(source, device, function () {
                return connected;
            });

            // Set the status handler
            sense.onStatusChanged = onStatus;

            // Set the data handler
            handModule.onFrameProcessed = onHandData;

            // SenseManager Initialization
            return sense.init();
        }).then(function (result) {

            // Configure Hand Tracking
            return handModule.createActiveConfiguration();
        }).then(function (result) {
            handConfig = result;

            // Enable all alerts
            handConfig.allAlerts = true;

            // Enable all gestures
            handConfig.allGestures = useNativeGestures;

            // Apply Hand Configuration changes
            return handConfig.applyChanges();
        }).then(function (result) {
            return handConfig.release();
        }).then(function (result) {

            // Start Streaming
            return sense.streamFrames();
        }).then(function (result) {
            var test;
        }).catch(function (error) {
            // handle pipeline initialization errors
            //TODO Handle ERRORS
        });
    }


    return {
        Start: Start
    }
});

﻿define('Input/Intel/RealSense/RealSense',['realsense', 'Input/DeviceManager', 'promise', 'autobahn'], function (realsense, deviceManager, p, ab) {
    window.autobahn = ab;
    var source = 'Intel RealSense';
    var trackingType;
    var useNativeGestures;

    function Configure(RealSenseConfiguration) {
        RealSenseConfiguration ={
            SenseType: RealSenseConfiguration.SenseType || 'Hands',
            Gestures: RealSenseConfiguration.Gestures || false
        }

        return RealSenseConfiguration;
    }

    function Initialize() {
        // Tells RealSense what to look for
        RealSenseConfiguration = Configure(Efficio.Devices.ReasSense);
        trackingType = RealSenseConfiguration.SenseType;
        useNativeGestures = RealSenseConfiguration.Gestures;

        return {
            TrackingType: trackingType,
            UseNativeGestures: useNativeGestures
        };
    }

    function Start() {
        // TODO test with just 'realsense'
        intel.realsense.SenseManager.createInstance().then(function (result) {
            sense = result;

            if (trackingType === 'Hands') {
                require(['Input/Intel/RealSense/Sense Type/Hands/HandTracking'], function (handler) {
                    handler.Start(sense, useNativeGestures);
                });
            }

        });
    }

    return {
        Initialize: Initialize,
        Start: Start
    }

});

﻿define('Input/Geolocation/Browser',['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = "Geolocaiton"
    var trackingType = 'Location';
    var pollTime;
    var enabled = false;

    function getGeolocation() {
        navigator.geolocation.getCurrentPosition(publishPosition);

        // Only poll for location every 30
        setTimeout(getGeolocation, pollTime);
    }

    function publishPosition(location) {
        bus.publish({
            channel: 'Input.Raw.Device',
            topic: 'Location',
            source: source,
            data: {
                TrackingType: trackingType,
                Location: location
            }
        });
    }

    function Initialize(EfficioConfiguration) {
        if (EfficioConfiguration.Devices.Location) {
            if (window.navigator) {
                if (navigator.geolocation) {
                    enabled = true;
                    pollTime = EfficioConfiguration.Devices.Location.PollingInterval * 1000 || 3000;

                    var device = {
                        Name: 'Location',
                        Manufacturer: 'Unknown',
                        Device: navigator.geolocation
                    }

                    deviceManager.Add(source, device, function () {
                        return enabled;
                    });
                }
            }
        }
    }

    function Start() {
        if (enabled) {
            window.requestAnimationFrame(getGeolocation);
        }
    }

    return {
        Initialize: Initialize,
        Start: Start
    }
});

﻿define('Input/Accelerometer/Browser2',['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = "Accelerometer"
    var trackingType = 'Orientation';
    var started = false;

    function Initialize(EfficioConfiguration) {
        // Listen for orientation changes
        window.addEventListener("deviceorientation", function (event) {
            if (started) {
                bus.publish({
                    channel: 'Input.Raw.Device',
                    topic: 'Device Orientation',
                    source: source,
                    data: {
                        TrackingType: trackingType,
                        DeviceOrientation: event
                    }
                });
            }
        }, false);

        window.addEventListener("orientationchange", function () {
            if (started) {
                bus.publish({
                    channel: 'Input.Raw.Device',
                    topic: 'Orientation Change',
                    source: source,
                    data: {
                        TrackingType: trackingType,
                        DeviceOrientation: window.orientation || 0
                    }
                });
            }
        }, false);
    }

    function Start() {
        started = true;
        deviceManager.Add(source, {
            Name: source,
            Manufacturer: "Unknown"
        },
        function () {
            return true;
        });
    }

    return {
        Initialize: Initialize,
        Start: Start
    }

});

﻿define('Efficio',[
    'Input Recognition and Processing/InputRecognitionAndProcessing',
    'Asset Management and Inventory/AssetManager',
    'Constraints Engine/ConstraintsEngine',
    'Command Issuance and Control/CommandIssuanceAndControl',
    'Command Issuance and Control/EventManager',
    'InternalScene',
    'Logging/SystemNotificationListener',
    'Input/DeviceManager',
    'Metrics/Metrics',
    'postal'
    //'Sequence Execution and Action Scheduling/CollisionDetectionAndGravitySimulation',
],

function (hirp, ami, constraintsEngine, comm, eventManager, internalScene, sysNotificationListener, deviceManager, metrics, bus) {
    var Efficio;
    var readyFired = false;

    function Configure(EfficioConfiguration) {
        EfficioConfiguration.Devices = EfficioConfiguration.Devices || {};
        EfficioConfiguration.Debug = EfficioConfiguration.Debug || false;
        EfficioConfiguration.ActionToFunctionMapping = EfficioConfiguration.ActionToFunctionMapping || { PluginName: 'NO PLUGIN CONFIGURED', ActionMappings: [] }

        Efficio.Configuration = EfficioConfiguration;
    }

    function CheckReady(func) {
        var ready = false;
        ready = CheckReadyConditions(func);
        if (ready && !readyFired) {
            readyFired = true;
            FireReadyEvent();
            Efficio.IsReady = true;
        }

        return ready;
    }

    function CheckReadyConditions(func) {
        var ready = true;

        if (typeof Efficio === 'undefined' || Efficio.Configuration === null) {
            return false;
        }

        // Check if DeviceManager Ready
        ready = ready && (Efficio.DeviceManager !== null) && (Efficio.DeviceManager.Ready());

        // Check if Metrics Ready
        ready = ready && (Efficio.Metrics !== null) && (Efficio.Metrics.Ready());

        // Check if external app is ready
        if (typeof func === 'function') {
            ready = ready && (func());
        }

        return ready
    }

    function FireReadyEvent() {
        bus.publish({
            channel: "Efficio",
            topic: "Ready",
            data: {
            }
        });
    }

    return {
        Initialize: function (EfficioConfiguration) {

            if (typeof Efficio === 'undefined' || Efficio === null) {
                Efficio = {
                    Started: false,
                    CheckReady: CheckReady,
                    IsReady: false,
                    MessagingSystem: bus
                };
            }

            if (window && (window.Efficio === null || typeof window.Efficio === 'undefined')) {
                window.Efficio = Efficio
            }

            Configure(EfficioConfiguration);

            Efficio.Metrics = metrics.Initialize();

            Efficio.InputAndGestureRecognition = hirp.Initialize(EfficioConfiguration);
            ami.Initialize();
            constraintsEngine.Initialize();
            Efficio.CommandIssuanceAndControl = comm.Initialize();
            Efficio.EventManager = eventManager.Initialize();
            Efficio.InternalScene = internalScene.Initialize();
            sysNotificationListener.Initialize();
            Efficio.DeviceManager = deviceManager.Initialize();

            if (EfficioConfiguration.Devices.LeapMotion) {
                require(['Input/LeapMotion/LeapMotion'], function (leap) {
                    leap.Initialize(EfficioConfiguration);
                    leap.Start();
                });
            }

            // JAMES -- I had to change this to get it to work
            if (EfficioConfiguration.Devices.Kinect) {
                require(['Input/Microsoft Kinect/Kinect'], function (kinect) {
                    kinect.Initialize();
                    kinect.Start();
                });
            }

            if (EfficioConfiguration.Devices.Microphone) {
                require(['Input/Microphone/Microphone'], function (microphone) {
                    microphone.Intitialize();
                    microphone.Start();
                });
            }

            if (EfficioConfiguration.Devices.XR3D) {
                require(['Input/XR3D/XR3D'], function (XR3D) {
                    XR3D.Initialize();
                    XR3D.Start();
                });
            }

            if (EfficioConfiguration.Devices.RealSense) {
                require(['Input/Intel/RealSense/RealSense'], function (realsense) {
                    realsense.Initialize();
                    realsense.Start();
                });
            }

            if (EfficioConfiguration.Devices.Location && window) {
                // Geolocation
                require(['Input/Geolocation/Browser'], function (browser) {
                    browser.Initialize(EfficioConfiguration);
                    browser.Start();
                })
            }

            if (EfficioConfiguration.Devices.Orientation && window) {
                // Accelerometer
                require(['Input/Accelerometer/Browser2'], function (browser) {
                    browser.Initialize(EfficioConfiguration);
                    browser.Start();
                })
            }
        },
        Start: function () {
            Efficio.Started = true;
            metrics.Start();
        }
    }
});

﻿if (typeof THREE === 'object') {
    define('three', function () { return THREE; });
}

if (typeof Leap === 'function') {
    define('leapjs', function () { return Leap; });
}

require(["Efficio"], function (Efficio) {
    Efficio.Initialize(EfficioConfiguration);
    Efficio.Start();
});

define("main", function(){});

