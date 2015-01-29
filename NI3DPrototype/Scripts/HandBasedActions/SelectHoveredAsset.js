var selectAssetOnHover = {
    action: function (hand)
    {
        var assets = assetManager.GetAssets();
        var intersectedAsset = getIntersectedAssets(hand, assets)[0];

        if (intersectedAsset)
        {
            if (!intersectedAsset.beginHoverTime)
                intersectedAsset.beginHoverTime = new Date();

            if ((new Date() - intersectedAsset.beginHoverTime) > 500)
            {
                if (assetManager.IsSelectedAsset(intersectedAsset.object))
                {
                    assetManager.DeselectAsset(intersectedAsset.object);
                }
                else
                {
                    assetManager.SelectAsset(intersectedAsset.object);
                }
            }
        }
        else
        {
            if (intersectedAsset)
            {
                intersectedAsset.beginHoverTime = null;
            }
        }
    }
}

function getIntersectedAssets(hand, assets)
{
    var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
    var directionVector = (new THREE.Vector3()).fromArray(hand.fingers[1].direction);
    raycaster.set(indexTipPosition, directionVector.normalize());
    raycaster.near = 0;
    raycaster.far = 400;

    var intersection = raycaster.intersectObjects(assets, true);
    return intersection;
}