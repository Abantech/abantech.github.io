/// <reference path="../../Libs/THREEJS/three.js" />
/// <reference path="../FrameActions.js" />
/// <reference path="../HandController.js" />

//Creates a menu option nthat is a square box of a specific size along with the following functions:
//functions to that define the actions of the pressed and hovered
//functions to determine whether or not the button can be pressed, hovered, shown or hovered 
//NOTE: any "condition" Callback should take a button as argument and return true or false
var menuButtonChildOption = function(buttonName, buttonSize, meshParameters,
    initializeAction,
    conditionForShow, conditionForHide,
    buttonPressedCallback, buttonNotPressedCallback, conditionForPressed,
    buttonHoveredCallback, buttonNotHoveredCallback, conditionForHover)
{
    this.size = buttonSize;
    this.geometry = new THREE.BoxGeometry(buttonSize, buttonSize, 2);
    this.conditionForShow = conditionForShow;
    this.conditionForHide = conditionForHide;
    this.conditionForHover = conditionForHover;
    this.conditionForPressed = conditionForPressed;
    this.meshParameters = meshParameters;
    this.buttonMesh = new THREE.Mesh(this.geometry, new THREE.MeshPhongMaterial(meshParameters));
    this.buttonMesh.name = buttonName;
    initializeAction(this);

    this.buttonHoveredAction = buttonHoveredCallback;
    this.onButtonHovered = function (hand) {
        if (!this.buttonMesh.visible)
            return;

        if (!this.buttonHoveredAction)
            return;

        if (isHoveringOverControls(hand, [button]))
        {
            if ((!this.conditionForHover) || this.conditionForHover(this.buttonMesh))
            {
                this.buttonHoveredAction(this.buttonMesh);
            }
        }
    }
    this.onButtonNotHovered = function (frame) {
        if (!buttonNotPressedCallback)
            return;

        if (this.buttonMesh.visible)
            buttonNotHoveredCallback(frame);
    }

    this.buttonPressedAction = buttonPressedCallback;
    this.onButtonPressed = function (hand) {
        if (!this.buttonMesh.visible)
            return;

        if (isButtonPressed(hand, button))
        {
            if ((!this.conditionForHover) || this.conditionForPressed(this.buttonMesh)) {
                this.buttonPressedAction(this.buttonMesh);
            }
        }
    }
    this.onButtonNotPressed = function (frame) {
        if (!buttonNotPressedCallback)
            return;

        if (this.buttonMesh.visible)
            buttonNotPressedCallback(frame);
    }
        

    this.tryShowButton = function (frame) {
        if (this.conditionForShow(frame))
            this.buttonMesh.traverse(function (object) { object.visible = true; })
    }

    this.tryHideButton = function (frame) {
        if (this.conditionForHide(frame))
            this.buttonMesh.traverse(function (object) { object.visible = false; })
    }

    handController.RegisterAction(this.buttonMesh.name + "_onButtonHovered", this.onButtonHovered);
    handController.RegisterAction(this.buttonMesh.name + "_onButtonPressed", this.onButtonPressed);
    frameActions.RegisterAction(this.buttonMesh.name + "_onButtonNotHovered", this.onButtonNotHovered);
    frameActions.RegisterAction(this.buttonMesh.name + "_onButtonNotPressed", this.onButtonNotPressed);
    frameActions.RegisterAction(this.buttonMesh.name + "_tryShowButton", this.tryShowButton);
    frameActions.RegisterAction(this.buttonMesh.name + "_tryHideButton", this.tryHideButton);
}

var raycaster = new THREE.Raycaster();

var isButtonPressed = function (hand, button) {
    var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
    var directionVector = (new THREE.Vector3()).fromArray(hand.fingers[1].direction);

    raycaster.set(indexTipPosition, directionVector.normalize());
    raycaster.near = 0;
    raycaster.far = 80;
    var intersection = raycaster.intersectObject(button, true);
    return intersection.length > 0;
}

var isHoveringOverControls = function (hand, controls) {
    //if (!minHoverDistance)
    //    minHoverDistance = 80

    var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
    var directionVector = (new THREE.Vector3()).fromArray(hand.fingers[1].direction);
    raycaster.set(indexTipPosition, directionVector.normalize());
    raycaster.near = 0;
    raycaster.far = 400;

    var intersection = raycaster.intersectObjects(controls, true);
    return intersection.length > 0;
}