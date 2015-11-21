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

    return {
        GetExtendedFingers: GetExtendedFingers,
        GetExtendedFingersIndicies: GetExtendedFingersIndicies,
        GetFingerLabel: GetFingerLabel,
        GetExtendedFingersCount: GetExtendedFingersCount,
        GetExtendedFingersCountLabel: GetExtendedFingersCountLabel,
        AreRequisiteFingersExtended: AreRequisiteFingersExtended
    }
})