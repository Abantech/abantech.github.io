var three = require('three');
var mesh;

function Extrude(data){
    console.log("Extrude Called");
    return 'Extruded Asset';
};

function Translate(data) {
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

    return mesh;
};

function Create(data) {
    if (!mesh) {
        console.log("Create Called");
        
        geometry = new three.BoxGeometry(200, 200, 200);
        material = new three.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        
        mesh = new three.Mesh(geometry, material);
        
        return mesh;
    }
};

module.exports = {
    Extrude: Extrude,
    Translate: Translate,
    Create: Create
}