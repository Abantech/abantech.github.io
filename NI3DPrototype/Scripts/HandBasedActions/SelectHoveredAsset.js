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
            if (!intersectedAsset.object.isPinched)
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
                    for (var i = 0; i < window.scene.children.length; i++)
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
                    if (window.scene.getObjectById(intersectedAsset.object.id).isSelected)
                    {
                        if (!assetLastSelectedTimeDictionary[intersectedAsset.object.uuid])
                            assetLastSelectedTimeDictionary[intersectedAsset.object.uuid] = new Date()

                        if ((new Date() - assetLastSelectedTimeDictionary[intersectedAsset.object.uuid]) > selectedAssetGracePeriodToDeselectTimeRequiredMills)
                        {
                            console.log("Asset was previously selected over threshold time of (" + selectedAssetGracePeriodToDeselectTimeRequiredMills + "ms). Delecting...");
                            assetManager.DeselectAsset(intersectedAsset.object);
                            removeHandles(intersectedAsset.object);
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

                        addHandlesToAsset(intersectedAsset.object);
                    }
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

    var intersectedAssets = new Array();

    var intersection = raycaster.intersectObjects(assets, true);

    if (intersection)
    {
        for (var i = 0; i < intersection.length; i++)
        {
            if (intersection[i].object.isAsset)
            {
                intersectedAssets.push(intersection[i]);
            }
        }
    }

    return intersectedAssets;
}

function addHandlesToAsset(asset)
{
    var sprites;
    var handle;

    THREE.ImageUtils.crossOrigin = '';
    var map = THREE.ImageUtils.loadTexture("Images/ball.png");
    var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
    handle = new THREE.Sprite(material);

    asset.geometry.computeBoundingBox();

    var boundingBox = asset.geometry.boundingBox;
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

    sprites = new THREE.Object3D();
    sprites.isHandles = true;

    asset.add(sprites);

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

        };

        var HSL = asset.material.color.getHSL();

        asset.material.color.setHSL(HSL.h, HSL.s, HSL.l + .2);

        asset.isSelected = true;
    }
}

function removeHandles(asset)
{
    for (var i = 0; i < asset.children.length; i++)
    {
        if (asset.children[i].isHandles)
        {
            asset.remove(asset.children[i]);
        }
    }

    var HSL = asset.material.color.getHSL();

    asset.material.color.setHSL(HSL.h, HSL.s, HSL.l - .2);

    asset.isSelected = false;
}

var updateBoundingBoxesOfSelectedAssets = function (frame)
{
    var selectedAssets = assetManager.GetSelectedAssets();

    for (var i = 0; i < selectedAssets.length; i++)
    {
        if (selectedAssets[i].hasBeenMoved)
        {
            selectedAssets[i].geometry.computeBoundingBox();
        }
    }
}