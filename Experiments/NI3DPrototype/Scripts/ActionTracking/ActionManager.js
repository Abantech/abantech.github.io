function ActionManager()
{
    var ActionList = new Array();
    var UndoneActions = new Array();

    this.ActionPerformed = function (action)
    {
        ActionList.push(action);
        UndoneActions = new Array();
    }

    this.Undo = function ()
    {
        var action = ActionList.pop();
        if (action)
        {
            UndoneActions.push(action);

            action.UndoAction();
        }
    }

    this.Redo = function ()
    {
        var action = UndoneActions.pop();
        if (action)
        {
            ActionList.push(action);

            action.RedoAction();
        }
    }
}

actionManager = new ActionManager();