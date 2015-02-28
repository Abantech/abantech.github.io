/// <reference path="../../Libs/Leap/leap-0.6.4.js" />
/// <reference path="../../Libs/Leap/leap.rigged-hand-0.1.6.js" />
/// <reference path="../AssetManager.js" />

var assetSelectHoverTimeRequiredMills = 1000
var selectedAssetGracePeriodToDeselectTimeRequiredMills = 3500
var assetHoveredTimeDictionary = {};
var assetLastSelectedTimeDictionary = {};
var lastHoveredObjectName = null;
var lastSelectedObjectName = null;
var assetMaterialOriginalColors = {};
var selectedAssetColor = 0xcc0000
var firstSelect = true;

var selectAssetOnHover = {
    action: function (hand) {
        
        if (hand.type === 'right' && getExtendedFingers(hand).length == 2 && hand.indexFinger.extended && hand.middleFinger.extended) {
            var assets = assetManager.GetAssets();
            var intersectedAsset = getIntersectedAssets(hand, assets)[0];

            if (intersectedAsset) {
                if (!intersectedAsset.object.userData.isPinched)
                {
                    if (!assetHoveredTimeDictionary[intersectedAsset.object.name]) {
                        console.log("Asset not previously in dictionary - Assigning hoveredTime now")
                        assetHoveredTimeDictionary[intersectedAsset.object.name] = new Date();
                        lastHoveredObjectName = intersectedAsset.object.name;
                    }
                    else {
                        //TODO: Move this to a frameAction
                        for (var i = 0; i < window.scene.children.length; i++) {
                            if (window.scene.children[i].name != lastHoveredObjectName && assetHoveredTimeDictionary[window.scene.children[i].name])
                            {
                                console.log("Removing unselected object from dictionary")
                                assetHoveredTimeDictionary[window.scene.children[i].name] = null;
                            }
                        }
                    }

                    intersectedAsset.beginHoverTime = assetHoveredTimeDictionary[intersectedAsset.object.name];

                    if ((new Date() - intersectedAsset.beginHoverTime) > assetSelectHoverTimeRequiredMills) {
                        console.log("Asset '" + intersectedAsset.object.name + "' hovered for more than threshold time of " + assetSelectHoverTimeRequiredMills + "ms")
                        if (assetManager.IsSelectedAsset(window.scene.getObjectById(intersectedAsset.object.id))) {
                            if (!assetLastSelectedTimeDictionary[intersectedAsset.object.name])
                                assetLastSelectedTimeDictionary[intersectedAsset.object.name] = new Date()

                            if ((new Date() - assetLastSelectedTimeDictionary[intersectedAsset.object.name]) > selectedAssetGracePeriodToDeselectTimeRequiredMills)
                            {
                                console.log("Asset was previously selected over threshold time of (" + selectedAssetGracePeriodToDeselectTimeRequiredMills + "ms). Delecting...");
                                playAudioFeedback("effect");
                                assetManager.DeselectAsset(intersectedAsset.object);
                                assetHoveredTimeDictionary[intersectedAsset.object.name] = null;
                                lastSelectedObjectName = null;

                            }
                            else {
                                console.log("Preventing Asset delection because asset was last selected under selection threshold time (" + selectedAssetGracePeriodToDeselectTimeRequiredMills + "ms).");
                            }
                        }
                        else {
                            console.log("Hovered Asset was not previously selected. Selecting...");

                            if (firstSelect && !$("#infoBox").dialog("isOpen"))
                            {
                                $("#infoBox").text("You have selected an object! Once selected, objects can be cut and copied, streched and scaled!")
                                $("#infoBox").dialog("open");
                                firstSelect = false;

                                setTimeout(function ()
                                {
                                    $("#infoBox").dialog("close");
                                }, 6000);
                            }

                            playAudioFeedback("effect");
                            assetManager.SelectAsset(intersectedAsset.object);
                            lastSelectedObjectName = intersectedAsset.object.name;
                            lastHoveredObjectName = intersectedAsset.object.name;
                            assetHoveredTimeDictionary[intersectedAsset.object.name] = new Date();
                            assetLastSelectedTimeDictionary[intersectedAsset.object.name] = new Date();
                        }
                    }
                }

            }
        }
    }
}

function getExtendedFingers(hand) {
    var extendedFingers = [];
    hand.fingers.forEach(function (finger) {
        if (finger.extended)
            extendedFingers.push(finger);
    });

    return extendedFingers;
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
            if (intersection[i].object.userData.isAsset) {
                intersectedAssets.push(intersection[i]);
            }
        }
    }

    return intersectedAssets;
}