﻿/// <reference path="../../Libs/THREEJS/three.js" />
/// <reference path="../FrameActions.js" />

var parentButtonSize = 24;
var childButtonSize = 65;
var buttonOffsetFactor = 1.06
var buttonPosition = new THREE.Vector3(window.innerWidth / 16, window.innerHeight / 18, -300)
var menuHoverToOpenDelayMills = 1200;
var menuOpenGracePeriodMills = 1100;
var url = window.location.href;
var defaultButtonColor = 0xffeeff;

//var texture = new THREE.Texture(img);
var geometry = new THREE.SphereGeometry(parentButtonSize, 32, 32);
geometry.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPosition.x, buttonPosition.y, buttonPosition.z));

var material = new THREE.MeshPhongMaterial({ wireframe: false, transparent: true, opacity: 0.5 });

if (url.substring(0, 4) != "file") {
    var texture = new THREE.Texture();

    //console.log("window.location : " + window.location.href);
    if (url.substring(0, 4) != "file") {
        var image = document.createElement('img');
        image.src = 'Images/NewShapeMenu.jpg';
        texture = new THREE.Texture(image);
        image.onload = function () {
            texture.needsUpdate = true;
        };
    }

    material.map = texture;
    material.needsUpdate = true;
}
else {
    material.color.setHex(defaultButtonColor);
}

var newShapesButton = new THREE.Mesh(geometry, material);

//newShapesButton.material.opacity = 0.2;
newShapesButton.userData.isAsset = false;
newShapesButton.material.color.setHex(0xffeeff);
newShapesButton.userData.menuIsExpanded = false;
newShapesButton.lastExpandedOrHoveredTime = null;
newShapesButton.visible = false;

var menuOptionLastUsedTime = null;

window.camera.add(newShapesButton);
var timeBetweenActionsMills = 2000;

var changeButtonColorOnHover = function (button) {
    //console.log("menuButtonChildOption - Setting button color on HOVERED...")
    newShapesButton.lastExpandedOrHoveredTime = new Date();
    button.material.color.setHex(0xAEB404);
}
var revertButtonColorOnNotHovered = function (button) {
    //console.log("menuButtonChildOption - resetting button color on NOT HOVERED...")
    button.material.color.setHex(0xcccccc);
}

var conditionForShowingNewShapeButtons = function (frame) {
    return newShapesButton.userData.menuIsExpanded;
}

var conditionForHidingNewShapeButtons = function (frame) {
    return !newShapesButton.userData.menuIsExpanded && (new Date() - newShapesButton.lastExpandedOrHoveredTime) > menuOpenGracePeriodMills;
}

var actionNotPerfomredWithinThresholdTime = function (button) {
    return (!menuOptionLastUsedTime || (new Date() - menuOptionLastUsedTime) > timeBetweenActionsMills)
}

var firstShape = true;
var createNewShapeChildOption = function (shapeName, offsetFactorX, offsetFactorY, iconColor, iconGeometry, createdShapeGeometry) {
    new menuButtonChildOption("Create" + shapeName + "Button", childButtonSize, { wireframe: false, transparent: true, opacity: 0.7 },
        function (menuButtonChildOption) {
            var sizeOffset = (menuButtonChildOption.size / 2) + 2;
            var translationMatrix = new THREE.Matrix4().makeTranslation(buttonPosition.x/2.3 + (sizeOffset * offsetFactorX), buttonPosition.y/2.3 + (sizeOffset * offsetFactorY), buttonPosition.z);
            var iconMesh = new THREE.Mesh(iconGeometry, new THREE.MeshPhongMaterial({ wireframe: false}))
            iconMesh.material.transparent = true;
            iconMesh.material.opacity = 0.5;
            iconMesh.material.color.setHex(iconColor);

            menuButtonChildOption.buttonMesh.applyMatrix(translationMatrix)
            window.camera.add(menuButtonChildOption.buttonMesh);
            newShapesButton.children.push(menuButtonChildOption.buttonMesh);

            //inner mesh that will be displayed on the button
            iconMesh.applyMatrix(translationMatrix)
            menuButtonChildOption.buttonMesh.children.push(iconMesh);
            window.camera.add(iconMesh);
            iconMesh.visible = false;
        }
        , conditionForShowingNewShapeButtons, conditionForHidingNewShapeButtons,
        function (button) {
            button.material.color.setHex(0x04B431);
            var mesh = new THREE.Mesh(createdShapeGeometry, new THREE.MeshPhongMaterial({ wireframe: false }))
            mesh.material.color.setHex(iconColor);
            mesh.position.set(0, 0, 0);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            assetManager.CreateAsset(shapeName, mesh);
            //playAudioFeedback("bass");

            if (showHelp && firstShape)
            {
                var utterance = new SpeechSynthesisUtterance("Congratulations on creating your first shape! Nice " + shapeName + "!");
                speechSynthesis.speak(utterance);
                firstShape = false;
            }

            console.log(shapeName + " Created due to button pressed!")
            menuOptionLastUsedTime = new Date();
//            newShapesButton.lastExpandedOrHoveredTime = new Date();
        }
        , null, actionNotPerfomredWithinThresholdTime, changeButtonColorOnHover, revertButtonColorOnNotHovered, null);
}

createNewShapeChildOption("Cube", -1 * buttonOffsetFactor, 1 * buttonOffsetFactor, 0x2E9AFE, new THREE.BoxGeometry(40, 40, 40), new THREE.BoxGeometry(18, 18, 18));
createNewShapeChildOption("Sphere", 1 * buttonOffsetFactor, 1 * buttonOffsetFactor, 0x7401DF, new THREE.SphereGeometry(25, 32, 32), new THREE.SphereGeometry(12, 32, 32));
createNewShapeChildOption("Cylinder", -1 * buttonOffsetFactor, -1 * buttonOffsetFactor, 0xFE642E, new THREE.CylinderGeometry(20, 20, 40, 32), new THREE.CylinderGeometry(12, 12, 32, 32));
createNewShapeChildOption("Cone", 1 * buttonOffsetFactor, -1 * buttonOffsetFactor, 0x0B4C5F, new THREE.CylinderGeometry(0, 20, 40, 32), new THREE.CylinderGeometry(0, 12, 32, 32));


var changeButtonColorOnHoverAndPress = {
    action: function (hand) {
        //Inactive: Brown = defaultButtonColor
        //Hovering: Yellow = 0xAEB404
        //Pressed: Green =  0x04B431
        if (isHoveringOverControls(hand, [newShapesButton])) {
            //newShapesButton.material.color.setHex(isButtonPressed(hand, newShapesButton) ? 0x04B431 : 0xAEB404);
            newShapesButton.material.color.setHex(0xAEB404);
        }
        else {
            newShapesButton.material.color.setHex(defaultButtonColor);
        }
    }
};

var closeMenuAfterDelay = function (frame) {
    if (newShapesButton.userData.menuIsExpanded)
    {
        //For some reason THREEJS clock is unrealiable in this scenario... Using good ol' javascript Date insted
        var expandedElapsedTime = new Date() - newShapesButton.lastExpandedOrHoveredTime

        //Close the menu only after the sufficient graceperiod has passed
        if (expandedElapsedTime > menuOpenGracePeriodMills) {
//            newShapesButton.visible = true;
            newShapesButton.userData.menuIsExpanded = false;
        }
    }
}

var firstMenuOpen = true;
var expandMenuSectionsOnHover = {
    action: function (hand) {
        if (!newShapesButton.userData.menuIsExpanded)
        {
            if (isHoveringOverControls(hand, [newShapesButton])) {
                if (!newShapesButton.beginHoverTime)
                    newShapesButton.beginHoverTime = new Date();

                if ((new Date() - newShapesButton.beginHoverTime) > menuHoverToOpenDelayMills) {
                    //Setting menuOptionLastUsedTime here prevents the shapes from getting created right as the menu opens
                    menuOptionLastUsedTime = new Date();
                    newShapesButton.visible = false;
                    newShapesButton.userData.menuIsExpanded = true;
                    newShapesButton.lastExpandedOrHoveredTime = new Date();

                    //playAudioFeedback("bass");

                    if (showHelp && firstMenuOpen)
                    {
                        var utterance = new SpeechSynthesisUtterance("This is the menu for shape creation! Hover over this sphere to reveal the shapes you can create!");
                        speechSynthesis.speak(utterance);
                        firstMenuOpen = false;
                    }
                }
            }
            else {
                newShapesButton.beginHoverTime = null;
            }
        }
        else {
            if (isHoveringOverControls(hand, newShapesButton.children)) {
                //Detected a hover over the children so reset the lastExpandedOrHoveredTime to keep it open
                newShapesButton.lastExpandedOrHoveredTime = new Date();
            }
        }
    }
}

var expandMenuSectionsOnFist = {
    action: function (hand) {
        if (!newShapesButton.userData.menuIsExpanded) {
            if (hand.thumb.extended &&
                !( 
                hand.indexFinger.extended || 
                hand.middleFinger.extended || 
                hand.ringFinger.extended || 
                hand.pinky.extended)
                //isHoveringOverControls(hand, [newShapesButton])
                ) {
                if (!newShapesButton.beginHoverTime)
                    newShapesButton.beginHoverTime = new Date();

                if ((new Date() - newShapesButton.beginHoverTime) > menuHoverToOpenDelayMills) {
                    //Setting menuOptionLastUsedTime here prevents the shapes from getting created right as the menu opens
                    menuOptionLastUsedTime = new Date();
                    newShapesButton.visible = false;
                    newShapesButton.userData.menuIsExpanded = true;
                    newShapesButton.lastExpandedOrHoveredTime = new Date();

                    //playAudioFeedback("bass");

                    if (showHelp && firstMenuOpen) {
                        var utterance = new SpeechSynthesisUtterance("This is the menu for shape creation! Hover over this sphere to reveal the shapes you can create!");
                        speechSynthesis.speak(utterance);
                        firstMenuOpen = false;
                    }
                }
            }
            else {
                newShapesButton.beginHoverTime = null;
            }
        }
        else {
            if (isHoveringOverControls(hand, newShapesButton.children)) {
                //Detected a hover over the children so reset the lastExpandedOrHoveredTime to keep it open
                newShapesButton.lastExpandedOrHoveredTime = new Date();
            }
        }
    }
}


//handController.RegisterAction("ExpandMenuSectionsOnHover", expandMenuSectionsOnHover);
handController.RegisterAction("ExpandMenuSectionsOnFist", expandMenuSectionsOnFist);
//handController.RegisterAction("ChangeButtonColorOnPress", changeButtonColorOnHoverAndPress);
frameActions.RegisterAction("CloseMenuAfterDelay", closeMenuAfterDelay);
