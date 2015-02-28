var savedScene;

function exportScene()
{
    return JSON.stringify(scene.toJSON(), null, '\t');
}

function importScene(json)
{
    scene = new THREE.ObjectLoader().parse(JSON.parse(json));
}