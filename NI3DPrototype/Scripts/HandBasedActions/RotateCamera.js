var axis = null;

var RotateCamera = function (hand)
{
    var indexTipPos = hand.fingers[1].tipPosition;
    var thumbTipPos = hand.fingers[0].tipPosition;

    var midPoint = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2).normalize();
    var camera = window.camera.position.clone().normalize();

    if (!axis)
    {
        axis = new THREE.Vector3(midPoint.x - camera.x, midPoint.y - camera.y, midPoint.z - camera.z);
    }

    var angle = hand.roll();
    window.camera.quaternion.setFromAxisAngle(axis, -1 * angle);

}

var EndRotateCamera = function (hand)
{
}