function TranslationAction()
{
    this.Initialize = function (object)
    {
        this.setActionName(object.name);
        this.setObjectName(object.name);
        this.setPositionBeforeTranslation(object.position);
    }

    this.RegisterTranslation = function (object)
    {
        this.setPositionAfterTranslation(object.position);
    }




    this.actionName;

    this.getActionName = function ()
    {
        return this.actionName;
    }

    this.setActionName = function (objectID)
    {
        this.actionName = "Translation of object with name = " + objectID.toString();
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


    this.positionBeforeTranslation;

    this.getPositionBeforeTranslation = function ()
    {
        return this.positionBeforeTranslation;
    }

    this.setPositionBeforeTranslation = function (positionVector)
    {
        this.positionBeforeTranslation = positionVector.clone();
    }




    this.positionAfterTranslation;

    this.getPositionAfterTranslation = function ()
    {
        return this.positionAfterTranslation;
    }

    this.setPositionAfterTranslation = function (positionVector)
    {
        this.positionAfterTranslation = positionVector.clone();
    }




    this.UndoAction = function ()
    {
        var sceneObject = window.scene.getObjectByName(this.getObjectName());
        var x = this.getPositionBeforeTranslation().x;
        var y = this.getPositionBeforeTranslation().y;
        var z = this.getPositionBeforeTranslation().z;
        sceneObject.position.set(x, y, z);
    }

    this.RedoAction = function myfunction()
    {
        var sceneObject = window.scene.getObjectByName(this.getObjectName());
        var x = this.getPositionAfterTranslation().x;
        var y = this.getPositionAfterTranslation().y;
        var z = this.getPositionAfterTranslation().z;
        sceneObject.position.set(x, y, z);
    }
}