function RotationAction()
{
    this.Initialize = function (object)
    {
        this.setActionName(object.name);
        this.setObjectName(object.name);
        this.setRotationBeforeRotated(object.rotation);
    }

    this.RegisterRotation = function (object)
    {
        this.setRotationAfterRotated(object.rotation);
    }




    this.actionName;

    this.getActionName = function ()
    {
        return this.actionName;
    }

    this.setActionName = function (objectID)
    {
        this.actionName = "Rotation of object with name = " + objectID.toString();
    }




    this.objectName;

    this.getObjectName = function ()
    {
        return this.objectName;
    }

    this.setObjectName = function (objectID)
    {
        this.objectName = objectID;
    }


    this.rotationBeforeRotated;

    this.getRotationBeforeRotated = function ()
    {
        return this.rotationBeforeRotated;
    }

    this.setRotationBeforeRotated = function (rotationEuler)
    {
        this.rotationBeforeRotated = rotationEuler.clone();
    }




    this.rotationAfterRotated;

    this.getRotationAfterRotated = function ()
    {
        return this.rotationAfterRotated;
    }

    this.setRotationAfterRotated = function (rotationEuler)
    {
        this.rotationAfterRotated = rotationEuler.clone();
    }




    this.UndoAction = function ()
    {
        var sceneObject = window.scene.getObjectByName(this.getObjectName());
        var order = this.getRotationBeforeRotated().order;
        var x = this.getRotationBeforeRotated().x;
        var y = this.getRotationBeforeRotated().y;
        var z = this.getRotationBeforeRotated().z;
        sceneObject.rotation.set(x, y, z, order);
    }

    this.RedoAction = function myfunction()
    {
        var sceneObject = window.scene.getObjectByName(this.getObjectName());
        var order = this.getRotationAfterRotated().order;
        var x = this.getRotationAfterRotated().x;
        var y = this.getRotationAfterRotated().y;
        var z = this.getRotationAfterRotated().z;
        sceneObject.rotation.set(x, y, z, order);
    }
}