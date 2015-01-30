var ScaleObject = function (hand)
{
    if (!pinchedObject)
    {
        pinchedObject = getPinchedObject(hand);
    }
    else
    {
        var indexTipPos = hand.fingers[1].tipPosition;
        var thumbTipPos = hand.fingers[0].tipPosition;

        var midPoint = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);

        var startPoition = pinchedObject.position.clone();

        var xScale = midPoint.x / startPoition.x;
        var yScale = midPoint.y / startPoition.y;
        var zScale = midPoint.z / startPoition.z;

            // Set the scalar to the new value
        pinchedObject.parent.parent.scale.set(pinchedObject.parent.parent.scale.x * xScale, pinchedObject.parent.parent.scale.y * yScale, pinchedObject.parent.parent.scale.z * zScale);
    }
}

var OnEndScaledObject = function (hand)
{
    if (pinchedObject && pinchedObject.isHandle)
    {
        var parent = pinchedObject.parent.parent;
        parent.geometry.computeBoundingBox();
        parent.remove(pinchedObject.parent);

        var boundingBox = parent.geometry.boundingBox;
        var min = boundingBox.min;
        var max = boundingBox.max;

        verts = new Array();
        verts.push(new THREE.Vector3(min.x, min.y, min.z));
        verts.push(new THREE.Vector3(min.x, max.y, min.z));
        verts.push(new THREE.Vector3(min.x, min.y, max.z));
        verts.push(new THREE.Vector3(min.x, max.y, max.z));
        verts.push(new THREE.Vector3(max.x, min.y, max.z));
        verts.push(new THREE.Vector3(max.x, max.y, min.z));
        verts.push(new THREE.Vector3(max.x, min.y, min.z));
        verts.push(new THREE.Vector3(max.x, max.y, max.z));

        // Uncomment if you want the individual verticies of the shape (Could be used for warping)
        //verts = asset.geometry.vertices;

        var map = THREE.ImageUtils.loadTexture("Images/ball.png");
        var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
        handle = new THREE.Sprite(material);
        sprites = new THREE.Object3D();
        sprites.isHandles = true;

        parent.add(sprites);

        if (verts.length)
        {
            for (var i = 0, v, sprite; i < verts.length; i++)
            {
                v = verts[i].clone();

                sprite = handle.clone();

                sprite.position.set(v.x, v.y, v.z);

                sprite.scale.set(2, 2, 2);

                sprite.isHandle = true;

                sprites.add(sprite);

            }
        }
    }
}

function getPinchedObject(hand)
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
                if (sceneObject.children[j].isHandles)
                {
                    for (var k = 0; k < sceneObject.children[j].children.length; k++)
                    {
                        var distance = mathHelper.DistanceBetweenPoints(indexTipVector, sceneObject.children[j].children[k].position);

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