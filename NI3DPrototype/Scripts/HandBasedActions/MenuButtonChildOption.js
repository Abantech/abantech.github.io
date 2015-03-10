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
    this.lastHoveredTime = null;
    initializeAction(this);

    var self = this;

    this.buttonHoveredAction = buttonHoveredCallback;
    this.onButtonHovered = {
        action: function (hand)
        {
            if (!self.buttonHoveredAction)
                return;

            if (!self.buttonMesh.visible)
                return;

            if (isHoveringOverControls(hand, [self.buttonMesh])) {
                self.lastHoveredTime = new Date()
                if ((!self.conditionForHover) || self.conditionForHover(self.buttonMesh))
                    self.buttonHoveredAction(self.buttonMesh);
            }
        }
    }

    this.onButtonNotHovered =
        function (frame)
        {
            if (!buttonNotHoveredCallback)
                return;

            if (!self.lastHoveredTime)
                return;
            
            if (self.buttonMesh.visible && (new Date() - self.lastHoveredTime) > 750)
                buttonNotHoveredCallback(self.buttonMesh);
        }

    this.buttonPressedAction = buttonPressedCallback;
    this.onButtonPressed = 
        function(frame)
        {
            if (!self.buttonMesh.visible)
                return;

            if (isButtonPressed(frame, self.buttonMesh))
            {
                if (!self.conditionForPressed)
                    console.warn("ConditionForPressed not defined on button " + self.buttonMesh.name)

                if (!self.conditionForPressed || self.conditionForPressed(self.buttonMesh))
                    self.buttonPressedAction(self.buttonMesh);
            }
        }

    this.onButtonNotPressed = function (frame) {
        if (!buttonNotPressedCallback)
            return;

        if (self.buttonMesh.visible)
            buttonNotPressedCallback(self.buttonMesh);
    }
        

    this.tryShowButton = function (frame) {
        if (self.conditionForShow(frame))
            self.buttonMesh.traverse(function (object) { object.visible = true; })
    }

    this.tryHideButton = function (frame) {
        if (self.conditionForHide(frame))
            self.buttonMesh.traverse(function (object) { object.visible = false; })
    }

    handController.RegisterAction(this.buttonMesh.name + "_onButtonHovered", this.onButtonHovered);
    frameActions.RegisterAction(this.buttonMesh.name + "_onButtonPressed", this.onButtonPressed);
    frameActions.RegisterAction(this.buttonMesh.name + "_onButtonNotHovered", this.onButtonNotHovered);
    frameActions.RegisterAction(this.buttonMesh.name + "_onButtonNotPressed", this.onButtonNotPressed);
    frameActions.RegisterAction(this.buttonMesh.name + "_tryShowButton", this.tryShowButton);
    frameActions.RegisterAction(this.buttonMesh.name + "_tryHideButton", this.tryHideButton);
}