

//if (frameActions) {
//    frameActions.RegisterAction("RemoveDeadSpheres",
//        function (frame) {
//            if (pinchLine) {
//                window.scene.remove(pinchLine);
//                pinchLine = null;
//            }
//        });
//}

var pinchLine, pinchLineGeometry;

var drawPinchLine = function (hand) {
    //if right hand only?
    if (!pinchLine) {
        pinchLine = createLineBetweenPoints(hand.indexFinger.tipPosition, hand.thumb.tipPosition);
        window.scene.add(pinchLine);
    }
    else {
        pinchLine.geometry.vertices[0] = hand.indexFinger.tipPosition;
        pinchLine.geometry.vertices[1] = hand.thumb.tipPosition;

        pinchLine.geometry.verticesNeedUpdate = true;
    }
}

function createLineBetweenPoints(startVect, endVect) {

    pinchLineGeometry = new THREE.Geometry();
    pinchLineGeometry.vertices.push(startVect);
    pinchLineGeometry.vertices.push(endVect);

    return new THREE.Line(pinchLineGeometry, new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.5 }));
}
