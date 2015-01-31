/// <reference path="../AssetManager.js" />

var assetSelectHoverTimeRequiredMills = 1000
var selectedAssetGracePeriodToDeselectTimeRequiredMills = 3500
var assetHoveredTimeDictionary = {};
var assetLastSelectedTimeDictionary = {};
var lastHoveredObjectUUID = null;
var lastSelectedObjectUUID = null;
var assetMaterialOriginalColors = {};
var selectedAssetColor = 0xcc0000

var selectAssetOnHover = {
    action: function (hand) {
        var assets = assetManager.GetAssets();
        var intersectedAsset = getIntersectedAssets(hand, assets)[0];

        if (intersectedAsset) {
            if (!intersectedAsset.object.isPinched) {
                if (!assetHoveredTimeDictionary[intersectedAsset.object.uuid]) {
                    console.log("Asset not previously in dictionary - Assigning hoveredTime now")
                    assetHoveredTimeDictionary[intersectedAsset.object.uuid] = new Date();
                    lastHoveredObjectUUID = intersectedAsset.object.uuid;
                }
                else {
                    //TODO: Move this to a frameAction
                    for (var i = 0; i < window.scene.children.length; i++) {
                        if (window.scene.children[i].uuid != lastHoveredObjectUUID && assetHoveredTimeDictionary[window.scene.children[i].uuid]) {
                            console.log("Removing unselected object from dictionary")
                            assetHoveredTimeDictionary[window.scene.children[i].uuid] = null;
                        }
                    }
                }

                intersectedAsset.beginHoverTime = assetHoveredTimeDictionary[intersectedAsset.object.uuid];

                if ((new Date() - intersectedAsset.beginHoverTime) > assetSelectHoverTimeRequiredMills) {
                    console.log("Asset '" + intersectedAsset.object.uuid + "' hovered for more than threshold time of " + assetSelectHoverTimeRequiredMills + "ms")
                    if (assetManager.IsSelectedAsset(window.scene.getObjectById(intersectedAsset.object.id))) {
                        if (!assetLastSelectedTimeDictionary[intersectedAsset.object.uuid])
                            assetLastSelectedTimeDictionary[intersectedAsset.object.uuid] = new Date()

                        if ((new Date() - assetLastSelectedTimeDictionary[intersectedAsset.object.uuid]) > selectedAssetGracePeriodToDeselectTimeRequiredMills) {
                            console.log("Asset was previously selected over threshold time of (" + selectedAssetGracePeriodToDeselectTimeRequiredMills + "ms). Delecting...");
                            assetManager.DeselectAsset(intersectedAsset.object);
                            removeHandles(intersectedAsset.object);
                            assetHoveredTimeDictionary[intersectedAsset.object.uuid] = null;
                            lastSelectedObjectUUID = null;

                        }
                        else {
                            console.log("Preventing Asset delection because asset was last selected under selection threshold time (" + selectedAssetGracePeriodToDeselectTimeRequiredMills + "ms).");
                        }
                    }
                    else {
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



function getIntersectedAssets(hand, assets) {
    var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
    var directionVector = (new THREE.Vector3()).fromArray(hand.fingers[1].direction);
    raycaster.set(indexTipPosition, directionVector.normalize());
    raycaster.near = 0;
    raycaster.far = 400;

    var intersectedAssets = new Array();

    var intersection = raycaster.intersectObjects(assets, true);

    if (intersection) {
        for (var i = 0; i < intersection.length; i++) {
            if (intersection[i].object.isAsset) {
                intersectedAssets.push(intersection[i]);
            }
        }
    }

    return intersectedAssets;
}

function addHandlesToAsset(asset) {
    asset.geometry.computeBoundingBox();

    var boundingbox = asset.geometry.boundingBox;
    var min = boundingbox.min;
    var max = boundingbox.max;

    xLength = boundingbox.max.x - boundingbox.min.x;
    yLength = boundingbox.max.y - boundingbox.min.y;
    zLength = boundingbox.max.z - boundingbox.min.z;


    var arrows = new THREE.Object3D();
    arrows.name = "Arrows";

    var xArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 15 + xLength * asset.scale.x / 2, 0xff0000);
    xArrow.name = "XArrow";
    xArrow.isArrow = true;

    var yArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 15 + yLength * asset.scale.y / 2, 0x0000ff);
    yArrow.name = "YArrow";
    yArrow.isArrow = true;

    var zArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 15 + zLength * asset.scale.z / 2, 0x00ff00);
    zArrow.name = "ZArrow";
    zArrow.isArrow = true;

    arrows.add(xArrow);
    arrows.add(yArrow);
    arrows.add(zArrow);

    arrows.scale.set(1 / asset.scale.x, 1 / asset.scale.y, 1 / asset.scale.z);
    arrows.isArrows = true;

    asset.add(arrows);
}

function removeHandles(asset) {
    asset.remove(asset.getObjectByName("Arrows"));

    var HSL = asset.material.color.getHSL();

    asset.material.color.setHSL(HSL.h, HSL.s, HSL.l - .2);

    asset.isSelected = false;
}

var updateBoundingBoxesOfSelectedAssets = function (frame) {
    var selectedAssets = assetManager.GetSelectedAssets();

    for (var i = 0; i < selectedAssets.length; i++) {
        if (selectedAssets[i].hasBeenMoved) {
            selectedAssets[i].geometry.computeBoundingBox();
        }
    }
}