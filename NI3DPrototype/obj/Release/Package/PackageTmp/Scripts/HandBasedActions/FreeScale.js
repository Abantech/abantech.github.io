var pinchedObjectDistance;
var originalScale;

var ScaleObject = function (hand)
{
    if (!pinchedObject)
    {
        pinchedObject = getPinchedObjectForScale(hand);
    }
    else
    {
        if (pinchedObject.isArrow)
        {
            var xScale = 1;
            var yScale = 1;
            var zScale = 1;

            var indexTipPos = hand.fingers[1].tipPosition;
            var thumbTipPos = hand.fingers[0].tipPosition;

            var midPoint = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);

            if (!pinchedObjectDistance)
            {
                pinchedObjectDistance = pinchedObject.distance;
            }

            if (!originalScale)
            {
                originalScale = pinchedObject.parent.parent.scale.clone();
            }

            switch (pinchedObject.name)
            {
                case "XArrow":
                    {
                        var objectCenterX = pinchedObject.position.x;
                        xScale = (midPoint.x - objectCenterX) / (pinchedObjectDistance - objectCenterX);
                        break;
                    }
                case "YArrow":
                    {
                        var objectCenterX = pinchedObject.position.y;
                        yScale = (midPoint.y - objectCenterX) / (pinchedObjectDistance - objectCenterX);
                        break;
                    }
                case "ZArrow":
                    {
                        var objectCenterX = pinchedObject.position.z;
                        zScale = (midPoint.z - objectCenterX) / (pinchedObjectDistance - objectCenterX);
                        break;
                    }
            }

            // Set the scalar to the new value
            try{
                pinchedObject.parent.parent.scale.set(originalScale.x * xScale, originalScale.y * yScale, originalScale.z * zScale);

            }
            catch (e){

            }
        }
    }
}

var OnEndScaledObject = function (hand)
{
    //if (pinchedObject && pinchedObject.isArrow)
    //{
    //    var parent = pinchedObject.parent.parent;
    //    parent.geometry.computeBoundingBox();
    //    parent.remove(pinchedObject.parent);

    //    var boundingBox = parent.geometry.boundingBox;
    //    var min = boundingBox.min;
    //    var max = boundingBox.max;

    //    xLength = boundingBox.max.x - boundingBox.min.x;
    //    yLength = boundingBox.max.y - boundingBox.min.y;
    //    zLength = boundingBox.max.z - boundingBox.min.z;


    //    var arrows = new THREE.Object3D();
    //    arrows.name = "Arrows";

    //    var xArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 5 + xLength, 0xff0000);
    //    xArrow.name = "XArrow";
    //    xArrow.isArrow = true;

    //    var yArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 5 + yLength, 0x0000ff);
    //    yArrow.name = "YArrow";
    //    yArrow.isArrow = true;

    //    var zArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 5 + zLength, 0x00ff00);
    //    zArrow.name = "ZArrow";
    //    zArrow.isArrow = true;

    //    arrows.add(xArrow);
    //    arrows.add(yArrow);
    //    arrows.add(zArrow);
    //    arrows.rotation.set(-pinchedObject.rotation.x, -pinchedObject.rotation.y, -pinchedObject.rotation.z, pinchedObject.order);

    //    pinchedObject.add(arrows)
    //}
}

function getPinchedObjectForScale(hand)
{
    var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);

    var closestObject = null;

    for (var i = 0; i < window.scene.children.length; i++)
    {
        var sceneObject = window.scene.children[i];

        if (sceneObject.isAsset && sceneObject.children.length > 0)
        {
            for (var j = 0; j < sceneObject.children.length; j++)
            {
                if (sceneObject.children[j].isArrows)
                {
                    for (var k = 0; k < sceneObject.children[j].children.length; k++)
                    {
                        var position = new THREE.Vector3();
                        position.getPositionFromMatrix(sceneObject.children[j].children[k].cone.matrixWorld);
                        var distance = mathHelper.DistanceBetweenPoints(indexTipVector, position);

                        if (distance < 50)
                        {
                            if (closestObject)
                            {
                                if (distance < closestObject.distance)
                                {
                                    closestObject = sceneObject.children[j].children[k];
                                    closestObject.distance = distance;
                                }
                            }
                            else
                            {
                                closestObject = sceneObject.children[j].children[k];
                                closestObject.distance = distance;
                            }
                        }
                    }
                }
            }
        }
    }

    return closestObject;
}

rightHandPinchGesture.registerOnFullGesture(
            {
                func: ScaleObject
            });

rightHandPinchGesture.registerOnFullGestureEnd(
        {
            func: OnEndScaledObject
        });