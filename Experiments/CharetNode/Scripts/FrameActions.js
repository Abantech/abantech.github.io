//Serves a registry for all actions that should be performed with each frame
var frameActions = new FrameActions();

function FrameActions() {
    var frameActions = []
    this.RegisterAction = function (name, frameAction) {
        frameActions.push(new FrameAction(name, frameAction));
    }

    this.UnregisterAction = function (name) {
        for (var i = 0; i < frameActions.length; i++) {
            if (frameActions[i].name == name)
                frameActions.splice(i, 1);
        }
    }

    this.RunAllActions = function (frame) {
        for (var i = 0 ; i < frameActions.length; i++) {
            frameActions[i].DoAction(frame);
        }
    }
}

//FrameAction expects to take a 'frame' as a parameter
function FrameAction(actionName, frameAction) {
    this.name = actionName;
    this.DoAction = frameAction;
}