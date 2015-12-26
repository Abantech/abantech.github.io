var collidableMeshList = new Array();

function DetectCollision(movingAsset)
{
    var collisionDetected = false;

    var originPoint = movingAsset.position.clone();

    for (var i = 0; i < collidableMeshList.length; i++)
    {
        if (collidableMeshList[i].uuid !== movingAsset.uuid)
        {
            var box1 = new THREE.Box3().setFromObject(movingAsset);
            var box2 = new THREE.Box3().setFromObject(collidableMeshList[i]);

            if (box1.isIntersectionBox(box2))
            {
                collisionDetected = true;
                break;
            }
        }
    }

    return collisionDetected;
}