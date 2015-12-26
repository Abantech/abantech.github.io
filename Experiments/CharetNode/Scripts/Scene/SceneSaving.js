var savedScene;

function exportScene()
{
    return JSON.stringify(scene.toJSON(), null, '\t');
}

function importScene(json)
{
    scene = new THREE.ObjectLoader().parse(JSON.parse(json));
}

function exportSceneAssets()
{
    var exportedScene = new THREE.Scene();
    for (var i = 0; i < scene.children.length; i++) 
    {
        var sceneObject = scene.children[i];
        if (sceneObject.userData.isAsset)
        {
            exportedScene.add(sceneObject);
        }
    }

    return JSON.stringify(exportedScene.toJSON(), null, '\t');
}