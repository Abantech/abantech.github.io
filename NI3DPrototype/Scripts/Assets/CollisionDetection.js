function DetectCollision(movingAsset)
{
    var collisionDetected = false;

    var originPoint = movingAsset.position.clone();
    var assets = assetManager.GetAssets();

    for (var i = 0; i < assets.length; i++)
    {
        if (assets[i].uuid !== movingAsset.uuid)
        {
            var box1 = new THREE.Box3().setFromObject(movingAsset);
            var box2 = new THREE.Box3().setFromObject(assets[i]);

            if (box1.isIntersectionBox(box2))
            {
                collisionDetected = true;
                break;
            }
        }
    }

    return collisionDetected;
}