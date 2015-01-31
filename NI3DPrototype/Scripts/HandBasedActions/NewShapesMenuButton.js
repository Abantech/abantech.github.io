/// <reference path="../../Libs/THREEJS/three.js" />
/// <reference path="../FrameActions.js" />
var buttonSize = 28;
var buttonPositionX = (window.innerWidth / 14);
var buttonPositionY = (window.innerHeight / 12);
var buttonPositionZ = -300;
var menuHoverToOpenDelayMills = 250;
var menuOpenGracePeriodMills = 900;
var url = window.location.href;

//var texture = new THREE.Texture(img);
var geometry = new THREE.SphereGeometry(16, 32, 32);
geometry.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX, buttonPositionY, buttonPositionZ));

var material = new THREE.MeshPhongMaterial({wireframe: false});

if (url.substring(0, 4) != "file")
{
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
else
{
    material.color.setHex(0x8A2908);
}

var newShapesButton = new THREE.Mesh(geometry, material);

//newShapesButton.material.opacity = 0.2;
newShapesButton.isAsset = false;
newShapesButton.material.color.setHex(0x8A2908);
newShapesButton.menuIsExpanded = false;
newShapesButton.lastExpandedOrHoveredTime = null;

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
    return newShapesButton.menuIsExpanded;
}

var conditionForHidingNewShapeButtons = function (frame) {
    return !newShapesButton.menuIsExpanded && (new Date() - newShapesButton.lastExpandedOrHoveredTime) > menuOpenGracePeriodMills;
}

var actionNotPerfomredWithinThresholdTime = function (button) {
    return (!menuOptionLastUsedTime || (new Date() - menuOptionLastUsedTime) > timeBetweenActionsMills)
}

var createNewShapeChildOption = function (shapeName, offsetFactorX, offsetFactorY, iconColor, iconGeometry, createdShapeGeometry) {
    new menuButtonChildOption("Create" + shapeName + "Button", buttonSize, { wireframe: false },
        function (menuButtonChildOption) {
            var sizeOffset = (menuButtonChildOption.size / 2) + 2;
            var translationMatrix = new THREE.Matrix4().makeTranslation(buttonPositionX + (sizeOffset * offsetFactorX), buttonPositionY + (sizeOffset * offsetFactorY), buttonPositionZ);
            var iconMesh = new THREE.Mesh(iconGeometry, new THREE.MeshPhongMaterial({ wireframe: false }))
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

            assetManager.CreateAsset(shapeName, mesh);
            console.log(shapeName + " Created due to button pressed!")
            menuOptionLastUsedTime = new Date();
        }
        , null, actionNotPerfomredWithinThresholdTime, changeButtonColorOnHover, revertButtonColorOnNotHovered, null);
}

createNewShapeChildOption("Cube", -1, 1, 0x2E9AFE, new THREE.BoxGeometry(15, 15, 15), new THREE.BoxGeometry(18, 18, 18));
createNewShapeChildOption("Sphere", 1, 1, 0x7401DF, new THREE.SphereGeometry(10, 32, 32), new THREE.SphereGeometry(12, 32, 32));
createNewShapeChildOption("Cylinder", -1, -1, 0xFE642E, new THREE.CylinderGeometry(8, 8, 16, 32), new THREE.CylinderGeometry(12, 12, 32, 32));
createNewShapeChildOption("Cone", 1, -1, 0x0B4C5F, new THREE.CylinderGeometry(0, 8, 22, 32), new THREE.CylinderGeometry(0, 12, 32, 32));


var changeButtonColorOnHoverAndPress = {
    action: function (hand) {
        //Inactive: Brown = 0x8A2908
        //Hovering: Yellow = 0xAEB404
        //Pressed: Green =  0x04B431
        if (isHoveringOverControls(hand, [newShapesButton])) {
            newShapesButton.material.color.setHex(isButtonPressed(hand, newShapesButton) ? 0x04B431 : 0xAEB404);
        }
        else {
            newShapesButton.material.color.setHex(0x8A2908);
        }
    }
};

var closeMenuAfterDelay = function (frame) {
    if (newShapesButton.menuIsExpanded) {
        //For some reason THREEJS clock is unrealiable in this scenario... Using good ol' javascript Date insted
        var expandedElapsedTime = new Date() - newShapesButton.lastExpandedOrHoveredTime

        //Close the menu only after the sufficient graceperiod has passed
        if (expandedElapsedTime > menuOpenGracePeriodMills) {
            newShapesButton.visible = true;
            newShapesButton.menuIsExpanded = false;
        }
    }
}

var expandMenuSectionsOnHover = {
    action: function (hand) {
        if (!newShapesButton.menuIsExpanded) {
            if (isHoveringOverControls(hand, [newShapesButton])) {
                if (!newShapesButton.beginHoverTime)
                    newShapesButton.beginHoverTime = new Date();

                if ((new Date() - newShapesButton.beginHoverTime) > menuHoverToOpenDelayMills) {
                    //Setting menuOptionLastUsedTime here prevents the shapes from getting created right as the menu opens
                    menuOptionLastUsedTime = new Date();
                    newShapesButton.visible = false;
                    newShapesButton.menuIsExpanded = true;
                    newShapesButton.lastExpandedOrHoveredTime = new Date();
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

handController.RegisterAction("ChangeButtonColorOnPress", changeButtonColorOnHoverAndPress);
handController.RegisterAction("ExpandMenuSectionsOnHover", expandMenuSectionsOnHover);
frameActions.RegisterAction("CloseMenuAfterDelay", closeMenuAfterDelay);