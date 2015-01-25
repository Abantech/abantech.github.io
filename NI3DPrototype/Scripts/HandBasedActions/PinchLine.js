var pinchLine, pinchLineGeometry;

var drawPinchLine = {
    action: function (hand)
    {

        var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);
        var thumbTipVector = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);

        //if right hand only?
        if (!pinchLine)
        {

            pinchLine = createLineBetweenPoints(indexTipVector, thumbTipVector);
            window.scene.add(pinchLine);
        }
        else
        {
            pinchLine.geometry.vertices[0] = indexTipVector;
            pinchLine.geometry.vertices[1] = thumbTipVector;

            pinchLine.geometry.verticesNeedUpdate = true;
        }
    }
}

function createLineBetweenPoints(startVect, endVect)
{

    pinchLineGeometry = new THREE.Geometry();
    pinchLineGeometry.vertices.push(startVect);
    pinchLineGeometry.vertices.push(endVect);

    return new THREE.Line(pinchLineGeometry, new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.5 }));
}