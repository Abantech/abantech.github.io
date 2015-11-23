define(function () {
    var fingerCountLabelsMap = ["Zero", "One", "Two", "Three", "Four", "Five"];
    var fingerNameLabelMap = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

    function GetExtendedFingers(hand){
        return hand.fingers.filter(function (finger) {
            return finger.extended;
        });
    }

    function GetExtendedFingersIndicies(hand) {
        return hand.fingers.filter(function (finger) {
            return finger.extended;
        }).map(function (finger) {
            return finger.type
        });
    }

    function GetFingerLabel(fingerIndex) {
        return fingerNameLabelMap[fingerIndex];
    }

    function GetExtendedFingersCount(hand) {
        return GetExtendedFingers(hand).length;
    }

    function GetExtendedFingersCountLabel(hand) {
        return fingerCountLabelsMap[GetExtendedFingersCount(hand)];
    }

    function AreRequisiteFingersExtended(hand, neededFingersArray) {
        var extendedFingers = GetExtendedFingers(hand);

        return extendedFingers.filter(function (n) {
            return neededFingersArray.indexOf(n) != -1
        }).length === neededFingersArray.length;
    }
    
    function DistanceBetweenFingers(finger1, finger2) {
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

    return {
        GetExtendedFingers: GetExtendedFingers,
        GetExtendedFingersIndicies: GetExtendedFingersIndicies,
        GetFingerLabel: GetFingerLabel,
        GetExtendedFingersCount: GetExtendedFingersCount,
        GetExtendedFingersCountLabel: GetExtendedFingersCountLabel,
        AreRequisiteFingersExtended: AreRequisiteFingersExtended,
        DistanceBetweenFingers: DistanceBetweenFingers
    }
})