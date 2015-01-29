var selectAssetOnHover = {
    action: function (hand)
    {
        var assets = assetManager.GetAssets();
        var intersectedAsset = getIntersectedAssets(hand, assets)[0];

        if (intersectedAsset)
        {
            if (!intersectedAsset.beginHoverTime)
            {
                intersectedAsset.beginHoverTime = new Date();
                console.log("ASSET NOT PREVIOUSLY HOVERED - ASSIGNING NOW")
            }
                

            if ((new Date() - intersectedAsset.beginHoverTime) > 500)
            {
                console.log("ASSET IS HOVERED")
                if (assetManager.IsSelectedAsset(intersectedAsset.object))
                {
                    console.log("ASSET IS DESELECTED")
                    assetManager.DeselectAsset(intersectedAsset.object);
                }
                else
                {
                    console.log("ASSET IS NOW SELECTED")
                    assetManager.SelectAsset(intersectedAsset.object);
                }
            }
        }
        else
        {
            if (intersectedAsset)
            {
                console.log("THIS SHOULD NEVER HAPPEN")
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