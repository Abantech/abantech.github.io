/// <reference path="../../Libs/THREEJS/three.js" />
/// <reference path="../FrameActions.js" />
var clock;
var menuControls = [];
var buttonSize = 16;
var buttonPositionX = (window.innerWidth / 14);
var buttonPositionY = (window.innerHeight / 12);
var buttonPositionZ = -300;
var menuHoverToOpenDelayMills = 250;
var menuOpenGracePeriodMills = 900;
var menuOptionVsLastTimeUsed = {};

//var image = new Image()
//var img = new Image();
//var texture = new THREE.Texture(img);
//img.onload = function () { texture.needsUpdate = true; };
//img.src = "Images/3D-shapes.jpg";
//texture.needsUpdate = true;
//var location = window.location.href.substring(7, 15);
var url = window.location.href;
var texture = new THREE.Texture();

//console.log("window.location : " + window.location.href);
if (url.substring(0, 4) != "file")
{
    var image = document.createElement('img');
    image.src = 'Images/NewShapeMenu.jpg';
    texture = new THREE.Texture(image);
    image.onload = function () {
        texture.needsUpdate = true;
    };
}

//var texture = new THREE.Texture(img);
var geometry = new THREE.SphereGeometry(16, 32, 32);
geometry.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX, buttonPositionY, buttonPositionZ));
console.log("window.innerWidth:" + window.innerWidth)
console.log("window.innerHeight:" + window.innerHeight)
var material = new THREE.MeshPhongMaterial({
    wireframe: false,
    map: texture//THREE.ImageUtils.loadTexture('Images/3D-shapes.jpg')

});
material.needsUpdate = true;
var newShapesButton = new THREE.Mesh(geometry, material);

//newShapesButton.material.opacity = 0.2;
newShapesButton.isAsset = false;
newShapesButton.material.color.setHex(0x8A2908);
newShapesButton.menuIsExpanded = false;
newShapesButton.lastExpandedOrHoveredTime = null;

var menuOptionLastUsedTime = null;

window.camera.add(newShapesButton);

function MenuOptionAction(optionButton, optionFunctionName, actionToFire, colorResetAction)
{
    this.button = optionButton;
    this.actionToFire = actionToFire;
    this.functionName = optionFunctionName;
    //this.setToDefaultColor = colorResetAction;
    this.action = function (hand) {
        //console.log("Executing menuOption : " + this.functionName)

        if (newShapesButton.menuIsExpanded)
        {
            //console.log("Setting " + optionFunctionName + " color to: " + this.defaultColor);
            this.button.material.color.setHex(null);
            //this.setToDefaultColor()
            //console.log("Executing menuOption " + this.functionName + " - Menu is expanded")
            if (isHoveringOverControls(hand, [this.button]))
            {
                //Hovering: Yellow = 0xAEB404
                //Pressed: Green =  0x04B431
                //console.log("Executing menuOption " + this.functionName + " - Menu button is hovered")
                this.button.material.color.setHex(0xAEB404);
                if (isButtonPressed(hand, this.button))
                {
                    this.button.material.color.setHex(0x04B431);
                    //.log("Executing menuOption " + this.functionName + " - Menu button is pressed")

                    if (!menuOptionLastUsedTime)
                    {
                        menuOptionLastUsedTime = new Date();
                        //console.log("Executing menuOption " + this.functionName + " - RUN MENU BUTTON ACTION")
                        this.actionToFire(hand)
                    }
                    else
                    {
                        var lastExecuted = new Date() - menuOptionLastUsedTime;
                        if (lastExecuted > 2000)
                        {
                            menuOptionLastUsedTime = new Date();
                            //console.log("Executing menuOption " + this.functionName + " - RUN MENU BUTTON ACTION")
                            this.actionToFire(hand)
                        }
                        else
                        {
                            //console.log("Executing menuOption " + this.functionName + " - ACTION PREVENTED DUE TO DELAY, " + lastExecuted)
                        }
                    }
                }
            }
        }
    }
}

var changeButtonColorOnHover = function (button) {
    console.log("menuButtonChildOption - Setting button color on HOVERED...")
    button.material.color.setHex(0xAEB404);
}
var revertButtonColorOnNotHovered = function (button) {
    console.log("menuButtonChildOption - resetting button color on NOT HOVERED...")
    button.material.color.setHex(0xcccccc);
}

var conditionForShowingNewShapeButtons = function (frame) {
    return newShapesButton.menuIsExpanded;
}

var conditionForHidingNewShapeButtons = function (frame) {
    return (new Date() - newShapesButton.lastExpandedOrHoveredTime) > 1500 && !newShapesButton.menuIsExpanded;
}

var actionNotPerfomredWithinThresholdTime = function (button) {
    return !menuOptionLastUsedTime || (new Date() - menuOptionLastUsedTime) > 2000
}

var initShapeCreateButton = function (menuButtonChildOption, translationMatrix, iconMesh) {
    menuButtonChildOption.buttonMesh.applyMatrix(translationMatrix)
    window.camera.add(menuButtonChildOption.buttonMesh);

    //inner mesh that will be displayed on the button
    iconMesh.applyMatrix(translationMatrix)
    menuButtonChildOption.buttonMesh.children.push(iconMesh);
    window.camera.add(iconMesh);
    iconMesh.visible = false;
}

var initBoxCreateButton = function (menuButtonChildOption) {
    var translationMatrix = new THREE.Matrix4().makeTranslation(buttonPositionX - menuButtonChildOption.size, buttonPositionY + menuButtonChildOption.size, buttonPositionZ);
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), new THREE.MeshPhongMaterial({ wireframe: false }))
    initShapeCreateButton(menuButtonChildOption, translationMatrix, mesh);
}

var createBoxOnMenuOptionPressed = function (button) {
    button.material.color.setHex(0xAEB404);
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(18, 18, 18), new THREE.MeshPhongMaterial({ wireframe: false }))
    mesh.material.color.setHex(0x2E9AFE);
    mesh.position.set(0, 0, 0);

    assetManager.CreateAsset("Cube", mesh);
    menuOptionLastUsedTime = new Date();
}

//Commented out this line - 
//JAMES/THEO - Help needed: can you comment out this line and comment out 162 to 183 and see if you cvan get it to work?
var newBoxOption = new menuButtonChildOption("CreateCubeButton", 28, { wireframe: false }, initBoxCreateButton, conditionForShowingNewShapeButtons, conditionForHidingNewShapeButtons, createBoxOnMenuOptionPressed, null, actionNotPerfomredWithinThresholdTime, changeButtonColorOnHover, revertButtonColorOnNotHovered, null);

//Register a menu option action, the action fires only once every 2 seconds
var registerMenuOptionAction = function (button, functionName, actionToFire) {
    var menuOptionAction = new MenuOptionAction(button, functionName, actionToFire);
    handController.RegisterAction(functionName, menuOptionAction);
}

var mesh = null

//var boxGeo1 = new THREE.BoxGeometry(28, 28, 2);
//boxGeo1.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX - buttonSize, buttonPositionY + buttonSize, buttonPositionZ))
//var otherButton1 = new THREE.Mesh(boxGeo1, new THREE.MeshPhongMaterial({ wireframe: false, color: 0x2E9AFE}));
//window.camera.add(otherButton1);
//otherButton1.visible = false;
//menuControls.push(otherButton1);

//otherButton1.defaultColor = 0x2E9AFE;
//mesh = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), new THREE.MeshPhongMaterial({ wireframe: false }))
//mesh.material.color.setHex(otherButton1.defaultColor);
//mesh.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX - buttonSize, buttonPositionY + buttonSize, buttonPositionZ))
//otherButton1.children.push(mesh);
//window.camera.add(mesh);
//mesh.visible = false;
//var createBoxOnMenuOptionPressed = function (hand) {
//    var mesh = new THREE.Mesh(new THREE.BoxGeometry(18, 18, 18), new THREE.MeshPhongMaterial({ wireframe: false }))
//    mesh.material.color.setHex(otherButton1.defaultColor);
//    mesh.position.set(0, 0, 0);

//    assetManager.CreateAsset("Cube", mesh);
//}
//registerMenuOptionAction(otherButton1, "CreateBoxOnMenuOptionPressed", createBoxOnMenuOptionPressed, function () { otherButton1.button.material.color.setHex(0x2E9AFE) });


var boxGeo2 = new THREE.BoxGeometry(28, 28, 2);
boxGeo2.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX - buttonSize, buttonPositionY - buttonSize, buttonPositionZ))
var otherButton2 = new THREE.Mesh(boxGeo2, new THREE.MeshPhongMaterial({ wireframe: false, color: 0x7401DF }));
window.camera.add(otherButton2);
otherButton2.visible = false;
menuControls.push(otherButton2);
otherButton2.defaultColor = 0x7401DF;
mesh = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshPhongMaterial({ wireframe: false }))
mesh.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX - buttonSize, buttonPositionY - buttonSize, buttonPositionZ))
mesh.material.color.setHex(otherButton2.defaultColor);
otherButton2.children.push(mesh);
window.camera.add(mesh);
mesh.visible = false;
var createSphereOnMenuOptionPressed = function (hand) {
    //var geometry = new THREE.SphereGeometry(16, 32, 32);
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(12, 32, 32), new THREE.MeshPhongMaterial({ wireframe: false }))
    mesh.position.set(0, 0, 0);
    mesh.material.color.setHex(otherButton2.defaultColor);

    assetManager.CreateAsset("Sphere", mesh);
}
registerMenuOptionAction(otherButton2, "CreateSphereOnMenuOptionPressed", createSphereOnMenuOptionPressed, function () { otherButton2.button.material.color.setHex(0x7401DF) });

var boxGeo3 = new THREE.BoxGeometry(28, 28, 2);
boxGeo3.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX + buttonSize, buttonPositionY + buttonSize, buttonPositionZ))
var otherButton3 = new THREE.Mesh(boxGeo3, new THREE.MeshPhongMaterial({ wireframe: false, color: 0xFE642E }));
window.camera.add(otherButton3);
otherButton3.visible = false;
menuControls.push(otherButton3);
otherButton3.defaultColor = 0xFE642E;
mesh = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 16, 32), new THREE.MeshPhongMaterial({ wireframe: false }))
mesh.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX + buttonSize, buttonPositionY + buttonSize, buttonPositionZ))
mesh.material.color.setHex(otherButton3.defaultColor);
otherButton3.children.push(mesh);
window.camera.add(mesh);
mesh.visible = false;
var createCylinderOnMenuOptionPressed = function (hand) {
    var mesh = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 32, 32), new THREE.MeshPhongMaterial({ wireframe: false }))
    mesh.position.set(0, 0, 0);
    mesh.material.color.setHex(otherButton3.defaultColor);

    assetManager.CreateAsset("Cylinder", mesh);
}
registerMenuOptionAction(otherButton3, "CreateCylinderOnMenuOptionPressed", createCylinderOnMenuOptionPressed, function () { otherButton2.button.material.color.setHex(0x0B4C5F) });

var boxGeo4 = new THREE.BoxGeometry(28, 28, 2);
boxGeo4.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX + buttonSize, buttonPositionY - buttonSize, buttonPositionZ))
var otherButton4 = new THREE.Mesh(boxGeo4, new THREE.MeshPhongMaterial({ wireframe: false, color: 0x0B4C5F }))
window.camera.add(otherButton4);
otherButton4.visible = false;
menuControls.push(otherButton4);
otherButton4.defaultColor = 0x0B4C5F;
mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 8, 22, 32), new THREE.MeshPhongMaterial({ wireframe: false }))
mesh.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX + buttonSize, buttonPositionY - buttonSize, buttonPositionZ))
mesh.material.color.setHex(otherButton4.defaultColor);
otherButton4.children.push(mesh);
window.camera.add(mesh);
mesh.visible = false;
var createConeOnMenuOptionPressed = function (hand) {
    //var geometry = new THREE.SphereGeometry(16, 32, 32);
    var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 12, 32, 32), new THREE.MeshPhongMaterial({ wireframe: false }))
    mesh.position.set(0, 0, 0);
    mesh.material.color.setHex(otherButton4.defaultColor);

    assetManager.CreateAsset("Cone", mesh);
}
registerMenuOptionAction(otherButton4, "CreateConeOnMenuOptionPressed", createConeOnMenuOptionPressed, function () { otherButton2.button.material.color.setHex(0xFE642E) });

var changeButtonColorOnHoverAndPress = {
    action: function (hand)
    {
        //Inactive: Brown = 0x8A2908
        //Hovering: Yellow = 0xAEB404
        //Pressed: Green =  0x04B431
        if (isHoveringOverControls(hand, [newShapesButton]))
        {
            newShapesButton.material.color.setHex(isButtonPressed(hand, newShapesButton) ? 0x04B431 : 0xAEB404);
        }
        else
        {
            newShapesButton.material.color.setHex(0x8A2908);
        }
    }
};

var closeMenuAfterDelay = function (frame) {
    if (newShapesButton.menuIsExpanded)
    {
        //For some reason THREEJS clock is unrealiable in this scenario... Using good ol' javascript Date insted
        var expandedElapsedTime = new Date() - newShapesButton.lastExpandedOrHoveredTime

        //Close the menu only after the sufficient graceperiod has passed
        if (expandedElapsedTime > menuOpenGracePeriodMills) {
            //console.log("closing because expanded elapsedTime was: " + expandedElapsedTime);
            menuControls.forEach(
                function (item, index, arr) {
                    item.visible = false
                    item.children.forEach(
                        function (child, childIndex, arr1)
                        {
                            child.visible = false
                        })
                }
                );
            newShapesButton.visible = true;
            newShapesButton.menuIsExpanded = false;
        }
    }
}



var expandMenuSectionsOnHover = {
    action: function (hand)
    {
        if (!newShapesButton.menuIsExpanded)
        {
            if (isHoveringOverControls(hand, [newShapesButton]))
            {
                if (!newShapesButton.beginHoverTime)
                    newShapesButton.beginHoverTime = new Date();

                if ((new Date() - newShapesButton.beginHoverTime) > menuHoverToOpenDelayMills)
                {
                    menuOptionLastUsedTime = new Date();
                    menuControls.forEach(
                        function (item, index, arr)
                        {
                            item.visible = true
                            item.children.forEach(
                                function (child, childIndex, arr1)
                                {
                                    child.visible = true;
                                })
                        }
                        );
                    newShapesButton.visible = false;
                    newShapesButton.menuIsExpanded = true;
                    newShapesButton.lastExpandedOrHoveredTime = new Date();
                }
            }
            else
            {
                newShapesButton.beginHoverTime = null;
            }
        }
        else
        {
            if (isHoveringOverControls(hand, menuControls))
            {
                //Detected a hover so reset the lastExpandedOrHoveredTime
                newShapesButton.lastExpandedOrHoveredTime = new Date();
            }
        }
    }
}

frameActions.RegisterAction("CloseMenuAfterDelay", closeMenuAfterDelay);