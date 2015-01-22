var handController = new HandController();

function HandController() {
    var handActions = []
    this.RegisterAction = function (name, handAction) {
        handActions.push(new HandAction(name, handAction));
    }

    this.UnregisterAction = function (name) {
        for(var i = 0; i< handActions.length; i++)
        {
            if (handActions[i].name == name)
                handActions.splice(i, 1);
        }
    }

    this.RunAllActions = function (hand) {
        for (var i = 0 ; i < handActions.length; i++) {
            handActions[i].DoAction(hand);
        }
    }
}

//HandAction expects to take a 'hand' as a parameter
function HandAction(actionName, handAction) {
    this.name = actionName;
    this.DoAction = handAction;
}