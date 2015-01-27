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

var geometry = new THREE.SphereGeometry(16, 32, 32);
geometry.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX, buttonPositionY, buttonPositionZ));
console.log("window.innerWidth:" + window.innerWidth)
console.log("window.innerHeight:" + window.innerHeight)
var material = new THREE.MeshPhongMaterial({ wireframe: false })
var newShapesButton = new THREE.Mesh(geometry, material);

//newShapesButton.material.opacity = 0.2;
newShapesButton.isAsset = false;
newShapesButton.material.color.setHex(0x8A2908);
newShapesButton.menuIsExpanded = false;
newShapesButton.lastExpandedOrHoveredTime = null;

window.camera.add(newShapesButton);

function MenuOptionAction(optionButton, optionFunctionName, actionToFire, colorHex)
{
    this.button = optionButton;
    this.actionToFire = actionToFire;
    this.functionName = optionFunctionName;
    this.defaultColor = colorHex;
    this.action = function (hand) {
        //console.log("Executing menuOption : " + this.functionName)

        if (newShapesButton.menuIsExpanded)
        {
            //console.log("Executing menuOption " + this.functionName + " - Menu is expanded")
            if (isHoveringOverControls(hand, [this.button]))
            {
                //console.log("Executing menuOption " + this.functionName + " - Menu button is hovered")
                this.button.material.color.setHex(0x04B431);
                if (isButtonPressed(hand, this.button))
                {
                    //.log("Executing menuOption " + this.functionName + " - Menu button is pressed")

                    if (!menuOptionVsLastTimeUsed[this.functionName])
                    {
                        menuOptionVsLastTimeUsed[this.functionName] = new Date();
                        console.log("Executing menuOption " + this.functionName + " - RUN MENU BUTTON ACTION")
                        this.actionToFire(hand)
                    }
                    else
                    {
                        var lastExecuted = (new Date() - menuOptionVsLastTimeUsed[this.functionName]);
                        if ((new Date() - menuOptionVsLastTimeUsed[this.functionName]) > 2000)
                        {
                            menuOptionVsLastTimeUsed[this.functionName] = new Date();
                            console.log("Executing menuOption " + this.functionName + " - RUN MENU BUTTON ACTION")
                            this.actionToFire(hand)
                        }
                        else
                        {
                            console.log("Executing menuOption " + this.functionName + " - ACTION PREVENTED DUE TO DELAY, " + lastExecuted)
                        }
                    }
                }
                else
                {
                    //console.log("Executing menuOption " + this.functionName + " - Button not pressed")
                }
            }
            else
            {
                //console.log("Executing menuOption " + this.functionName + " - No hover detected")
                this.button.material.color.setHex(this.defaultColor);
            }
        }
    }
}

//Register a menu option action, the action fires only once every 2 seconds
var registerMenuOptionAction = function (button, functionName, actionToFire) {
    var menuOptionAction = new MenuOptionAction(button, functionName, actionToFire);
    handController.RegisterAction(functionName, menuOptionAction);
}

var boxGeo1 = new THREE.BoxGeometry(28, 28, 2);
boxGeo1.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX - buttonSize, buttonPositionY + buttonSize, buttonPositionZ))
var otherButton1 = new THREE.Mesh(boxGeo1, new THREE.MeshPhongMaterial({ wireframe: false }));
window.camera.add(otherButton1);
otherButton1.visible = false;
menuControls.push(otherButton1);
var createBoxOnMenuOptionPressed = function (hand) {
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), new THREE.MeshPhongMaterial({ wireframe: false }))
    //mesh.position.copy((new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition))
    mesh.position.set(0, 0, 0);
    mesh.isAsset = true;
    window.scene.add(mesh);
}
registerMenuOptionAction(otherButton1, "CreateBoxOnMenuOptionPressed", createBoxOnMenuOptionPressed, 0x2E9AFE);

var boxGeo2 = new THREE.BoxGeometry(28, 28, 2);
boxGeo2.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX - buttonSize, buttonPositionY - buttonSize, buttonPositionZ))
var otherButton2 = new THREE.Mesh(boxGeo2, new THREE.MeshPhongMaterial({ wireframe: false }));
window.camera.add(otherButton2);
otherButton2.visible = false;
menuControls.push(otherButton2);
var createSphereOnMenuOptionPressed = function (hand) {
    //var geometry = new THREE.SphereGeometry(16, 32, 32);
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(12, 32, 32), new THREE.MeshPhongMaterial({ wireframe: false }))
    //mesh.position.copy((new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition))
    mesh.position.set(0, 0, 0);
    mesh.isAsset = true;
    window.scene.add(mesh);
}
registerMenuOptionAction(otherButton2, "CreateSphereOnMenuOptionPressed", createSphereOnMenuOptionPressed, 0x7401DF);

var boxGeo3 = new THREE.BoxGeometry(28, 28, 2);
boxGeo3.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX + buttonSize, buttonPositionY + buttonSize, buttonPositionZ))
var otherButton3 = new THREE.Mesh(boxGeo3, new THREE.MeshPhongMaterial({ wireframe: false }));
window.camera.add(otherButton3);
otherButton3.visible = false;
menuControls.push(otherButton3);
var createCylinderOnMenuOptionPressed = function (hand) {
    var mesh = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 12), new THREE.MeshPhongMaterial({ wireframe: false }))
    //mesh.position.copy((new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition))
    mesh.position.set(0, 0, 0);
    mesh.isAsset = true;
    window.scene.add(mesh);
}
registerMenuOptionAction(otherButton3, "CreateCylinderOnMenuOptionPressed", createCylinderOnMenuOptionPressed, 0x0B4C5F);

var boxGeo4 = new THREE.BoxGeometry(28, 28, 2);
boxGeo4.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX + buttonSize, buttonPositionY - buttonSize, buttonPositionZ))
var otherButton4 = new THREE.Mesh(boxGeo4, new THREE.MeshPhongMaterial({ wireframe: false }));
window.camera.add(otherButton4);
otherButton4.visible = false;
menuControls.push(otherButton4);
var createConeOnMenuOptionPressed = function (hand) {
    //var geometry = new THREE.SphereGeometry(16, 32, 32);
    var mesh = new THREE.Mesh(new THREE.CylinderGeometry(8, 0.1, 12), new THREE.MeshPhongMaterial({ wireframe: false }))
    //mesh.position.copy((new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition))
    mesh.position.set(0, 0, 0);
    mesh.isAsset = true;
    window.scene.add(mesh);
}
registerMenuOptionAction(otherButton4, "CreateConeOnMenuOptionPressed", createConeOnMenuOptionPressed, 0xFE642E);

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


var menuButton1Clicked = {
    action: function (hand) {
        if (newShapesButton.menuIsExpanded)
        {
            if (isHoveringOverControls(hand, [otherButton1]))
            {
                console.log("Hover detected by menuButton1Clicked")
                
                otherButton1.material.color.setHex(0xAEB404);
                if (isButtonPressed(hand, otherButton1))
                {
                    otherButton1.material.color.setHex(0x04B431);
                    createBoxOnMenuOptionPressed(hand);
                }//? 0x00cc00 : 0x0000ff
                //otherButton1.material.color.setHex(isButtonPressed(hand, otherButton1) ? 0x00cc00 : 0x0000ff);
            }
            else
            {
                otherButton1.material.color.setHex(0x8A2908);
            }
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
            menuControls.forEach(function (item, index, arr) { item.visible = false });
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
                    menuControls.forEach(function (item, index, arr) { item.visible = true });
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

function isButtonPressed(hand, button)
{
    var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);
    var indexTipDirection = (new THREE.Vector3()).fromArray(hand.fingers[0].direction);
    indexTipDirection.normalize();
    //!?! Have to use the thumb as the other end of the ray, do not know why it's not working with the pipPosition or mcpPosition
    var indexPipVector = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);

    var dir = new THREE.Vector3();
    dir.subVectors(indexTipPosition, indexPipVector).normalize();

    var raycaster = new THREE.Raycaster(indexPipVector, indexTipDirection, 0, 50);

    var intersection = raycaster.intersectObject(button, true);
    return intersection.length > 0;
}

function isHoveringOverControls(hand, controls) {
    var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);
    var indexTipDirection = (new THREE.Vector3()).fromArray(hand.fingers[0].direction);
    indexTipDirection.normalize();
    //!?! Have to use the thumb as the other end of the ray, do not know why it's not working with the pipPosition or mcpPosition
    var indexPipVector = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);

    var dir = new THREE.Vector3();
    dir.subVectors(indexTipPosition, indexPipVector).normalize();

    var raycaster = new THREE.Raycaster(indexPipVector, indexTipDirection, 0, 400);

    var intersection = raycaster.intersectObjects(controls, true);
    return intersection.length > 0;
}

frameActions.RegisterAction("CloseMenuAfterDelay", closeMenuAfterDelay);


/////// DEAD CODE BELOW ///////


var menuActionInProgress = null
var menuresizeItterationsCount = 0;
var maxMenuResizeItterations = 20;
var expansionFactor = 1 / maxMenuResizeItterations;
//var shrinkFactor = 0.9;

var shrinkMenuBoxesAndExpandButton = function (frame) {
    if (!menuActionInProgress) {
        menuActionInProgress = "shrinkMenuBoxesAndExpandButton";
        menuresizeItterationsCount = 0;
    }
    else if (menuActionInProgress == "shrinkMenuBoxesAndExpandButton") {
        console.log("newShapesMenuButton.scale = " + newShapesButton.scale.x)
        if (menuresizeItterationsCount < maxMenuResizeItterations) {
            menuresizeItterationsCount++;
            for (var i = 0; i < menuControls.length; i++) {
                menuControls[i].scale.x -= expansionFactor;
                menuControls[i].scale.y -= expansionFactor;
            }

            if (newShapesButton.scale.x < 1) {
                newShapesButton.scale.x += expansionFactor;
                newShapesButton.scale.y += expansionFactor;
                newShapesButton.scale.z += expansionFactor;
            }
        }
        else {
            newShapesButton.menuIsExpanded = false;
            console.log("UnRegistering FrameAction: ShrinkMenuBoxes")
            frameActions.UnregisterAction("ShrinkMenuBoxes");
            menuActionInProgress = null;
        }
    }
}

var expandMenuBoxesAndShrinkButton = function (frame) {
    if (!menuActionInProgress) {
        menuActionInProgress = "expandMenuBoxesAndShrinkButton";
        menuresizeItterationsCount = 0;
    }
    else if (menuActionInProgress == "expandMenuBoxesAndShrinkButton") {
        if (menuresizeItterationsCount < maxMenuResizeItterations) {
            menuresizeItterationsCount++;
            for (var i = 0; i < menuControls.length; i++) {
                menuControls[i].scale.x += expansionFactor;
                menuControls[i].scale.y += expansionFactor;
            }

            newShapesButton.scale.x -= expansionFactor;
            newShapesButton.scale.y -= expansionFactor;
            newShapesButton.scale.z -= expansionFactor;
        }
        else {
            newShapesButton.menuIsExpanded = true;
            console.log("UnRegistering FrameAction: ExpandMenuBoxes")
            frameActions.UnregisterAction("ExpandMenuBoxes");
            menuActionInProgress = null;
        }
    }
}

var createBoxAfterDelay = {
    action: function (hand) {
        if (isButtonPressed(hand, newShapesButton)) {
            if (!clock) {
                clock = new THREE.Clock(true);
                clock.start();
            } else {
                if (clock.getElapsedTime() > 0.2) {
                    if (box) {
                        box.rotation.x += 0.001;
                        box.rotation.y += 0.03;
                    } else {
                        box = createBox(40, 40, 40, new THREE.Vector3(0, 0, 0), 0xabcdef);
                        box.isAsset = true;
                        box.name = "box";
                        window.scene.add(box);
                        clock = null;
                    }
                }
            }
        } else {
            clock = null;
        }
    }
}