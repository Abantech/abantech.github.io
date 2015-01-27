function CreateAction()
{
    this.Initialize = function (object)
    {
        this.setActionName(object.name);
        this.setObjectName(object.name);
        this.setCreatedObject(object);
    }



    this.actionName;

    this.getActionName = function ()
    {
        return this.actionName;
    }

    this.setActionName = function (objectID)
    {
        this.actionName = "Creation of object with name = " + objectID.toString();
    }




    this.objectName;

    this.getObjectName = function ()
    {
        return this.objectName;
    }

    this.setObjectName = function (objectID)
    {
        this.objectName = objectID.toString();
    }
    



    this.createdObject;

    this.getCreatedObject = function ()
    {
        return this.createdObject;
    }

    this.setCreatedObject = function (object)
    {
        this.createdObject = object.clone();
    }




    this.UndoAction = function ()
    {
        var sceneObject = window.scene.getObjectByName(this.getObjectName());
        window.scene.remove(sceneObject);
    }

    this.RedoAction = function myfunction()
    {
        var createdObject = this.getCreatedObject();
        createdObject.isAsset = true;
        window.scene.add(createdObject);
    }
}