define(function () {
    function GetSide(hand) {
        return hand.type === 'right' ? 'Right' : 'Left';
    }

    function GetAngle(hand) {
        return hand.direction[1];
    }

    return {
        GetSide: GetSide,
        GetAngle: GetAngle
    }
})