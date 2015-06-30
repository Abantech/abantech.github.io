var three = require('three');
var mesh;

function Log(data){
    console.log(data.message);
}

function Extrude(data, returnedFromFunction){
    returnedFromFunction.MyUpdatedAsset = 'Extruded Asset';
};

function MyFunction(){
    console.log("CHAINED");
}

function Translate(data, returnedFromFunction) {

    console.log("Translate Called");
    
    if (mesh.position.x === 0) {
        mesh.position.x = 1;
        mesh.position.y = 1;
        mesh.position.z = 1;
    }
    else {
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;
    }

    returnedFromFunction.MyUpdatedAsset = mesh;
    returnedFromFunction.MyMessage = "Message from within sketchup";
};

function Create(data, returnedFromFunction) {
    returnedFromFunction.publishResults = false;

    if (!mesh) {
        console.log("Create Called");
        
        geometry = new three.BoxGeometry(200, 200, 200);
        material = new three.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        
        mesh = new three.Mesh(geometry, material);

        returnedFromFunction.MyUpdatedAsset = mesh;
        returnedFromFunction.publishResults = true;
    }


};

module.exports = {
    Extrude: Extrude,
    Translate: Translate,
    Create: Create,
    Log: Log,
    MyFunction: MyFunction
}