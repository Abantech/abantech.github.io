var raycaster = new THREE.Raycaster();

var isButtonPressed = function(hand, button) {
    var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
    var directionVector = (new THREE.Vector3()).fromArray(hand.fingers[1].direction);

    raycaster.set(indexTipPosition, directionVector.normalize());
    raycaster.near = 0;
    raycaster.far = 80;
    var intersection = raycaster.intersectObject(button, true);
    return intersection.length > 0;
}

var isHoveringOverControls = function (hand, controls) {
    //if (!minHoverDistance)
    //    minHoverDistance = 80

    var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
    var directionVector = (new THREE.Vector3()).fromArray(hand.fingers[1].direction);
    raycaster.set(indexTipPosition, directionVector.normalize());
    raycaster.far = 400;

    var intersection = raycaster.intersectObjects(controls, true);
    return intersection.length > 0;
}