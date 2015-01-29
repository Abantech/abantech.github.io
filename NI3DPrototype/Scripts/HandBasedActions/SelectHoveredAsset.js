var assetSelectHoverTimeRequiredMills = 1000
var selectedAssetGracePeriodToDeselectTimeRequiredMills = 3500
var assetHoveredTimeDictionary = {};
var assetLastSelectedTimeDictionary = {};
var lastHoveredObjectUUID = null;
var lastSelectedObjectUUID = null;
var assetMaterialOriginalColors = {};
var selectedAssetColor = 0xcc0000

var selectAssetOnHover = {
    action: function (hand)
    {
        var assets = assetManager.GetAssets();
        var intersectedAsset = getIntersectedAssets(hand, assets)[0];

        if (intersectedAsset)
        {
            if (!assetHoveredTimeDictionary[intersectedAsset.object.uuid])
            {
                console.log("Asset not previously in dictionary - Assigning hoveredTime now")
                assetHoveredTimeDictionary[intersectedAsset.object.uuid] = new Date();
                lastHoveredObjectUUID = intersectedAsset.object.uuid;
            }
            else
            {
                //TODO: Move this to a frameAction
                for(var i = 0; i < window.scene.children.length; i++)
                {
                    if (window.scene.children[i].uuid != lastHoveredObjectUUID && assetHoveredTimeDictionary[window.scene.children[i].uuid])
                    {
                        console.log("Removing unselected object from dictionary")
                        assetHoveredTimeDictionary[window.scene.children[i].uuid] = null;
                    }
                }
            }
            
            intersectedAsset.beginHoverTime = assetHoveredTimeDictionary[intersectedAsset.object.uuid];

            if ((new Date() - intersectedAsset.beginHoverTime) > assetSelectHoverTimeRequiredMills)
            {
                console.log("Asset '" + intersectedAsset.object.uuid + "' hovered for more than threshold time of " + assetSelectHoverTimeRequiredMills + "ms")
                if (lastSelectedObjectUUID == intersectedAsset.object.uuid)
                {
                    if (!assetLastSelectedTimeDictionary[intersectedAsset.object.uuid])
                        assetLastSelectedTimeDictionary[intersectedAsset.object.uuid] = new Date()

                    if ((new Date() - assetLastSelectedTimeDictionary[intersectedAsset.object.uuid]) > selectedAssetGracePeriodToDeselectTimeRequiredMills)
                    {
                        console.log("Asset was previously selected over threshold time of (" + selectedAssetGracePeriodToDeselectTimeRequiredMills + "ms). Delecting...");
                        assetManager.DeselectAsset(intersectedAsset.object);
                        assetHoveredTimeDictionary[intersectedAsset.object.uuid] = null;
                        lastSelectedObjectUUID = null;
                        
                    }
                    else
                    {
                        console.log("Preventing Asset delection because asset was last selected under selection threshold time (" + selectedAssetGracePeriodToDeselectTimeRequiredMills + "ms).");
                    }
                }
                else
                {
                    console.log("Hovered Asset was not previously selected. Selecting...");
                    assetManager.SelectAsset(intersectedAsset.object);
                    lastSelectedObjectUUID = intersectedAsset.object.uuid;
                    lastHoveredObjectUUID = intersectedAsset.object.uuid;
                    assetHoveredTimeDictionary[intersectedAsset.object.uuid] = new Date();
                    assetLastSelectedTimeDictionary[intersectedAsset.object.uuid] = new Date();
                    intersectedAsset.object.material.color.setHex(selectedAssetColor);
                }
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

var restoreUnselectedAssetToOrignalColor = function (frame) {
    for (var i = 0; i < window.scene.children.length; i++) {
        if (window.scene.children[i].isAsset)
        {
            //Save asset original color if not already saved
            if (!assetMaterialOriginalColors[window.scene.children[i].uuid])
                assetMaterialOriginalColors[window.scene.children[i].uuid] = window.scene.children[i].material.color.getHex();

            if (!assetManager.IsSelectedAsset(window.scene.children[i]) && window.scene.children[i].material.color.getHex() != assetMaterialOriginalColors[window.scene.children[i].uuid])
            {
                console.log("Resetting Asset to original color...")
                window.scene.children[i].material.color.setHex(assetMaterialOriginalColors[window.scene.children[i].uuid]);
            }
        }
    }
}

frameActions.RegisterAction("RestoreUnselectedAssetToOrignalColor", restoreUnselectedAssetToOrignalColor);