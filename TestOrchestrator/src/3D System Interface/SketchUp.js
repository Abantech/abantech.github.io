var THREE = require('three');
var mesh;

SketchUp = {
    
    Log: function (data) {
        console.log(data.message);
    },
    
    Extrude: function (data, returnedFromFunction) {
        returnedFromFunction.MyUpdatedAsset = 'Extruded Asset';
    },
    
    MyFunction: function () {
        console.log("CHAINED");
    },
    
    Translate: function Translate(PinchPosition, ClosestAsset, returnedFromFunction) {
        
        console.log("Translate Called");
        console.log(PinchPosition);
        console.log(ClosestAsset);
        
        if (mesh.position.x === 0) {
            mesh.position.x = PinchPosition.x;
            mesh.position.y = PinchPosition.y;
            mesh.position.z = PinchPosition.z;
        }
        else {
            mesh.position.x = 0;
            mesh.position.y = 0;
            mesh.position.z = 0;
        }
        
        returnedFromFunction.MyUpdatedAsset = mesh;
        returnedFromFunction.MyMessage = "Message from within sketchup";
    },
    
    Create: function (data, returnedFromFunction) {
        returnedFromFunction.publishResults = false;
        
        if (!mesh) {
            console.log("Create Called");
            
            geometry = new THREE.BoxGeometry(200, 200, 200);
            material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
            
            mesh = new THREE.Mesh(geometry, material);
            
            returnedFromFunction.MyUpdatedAsset = mesh;
            returnedFromFunction.publishResults = true;
        }


    }
}

module.exports = {
    Extrude: SketchUp.Extrude,
    Translate: SketchUp.Translate,
    Create: SketchUp.Create,
    Log: SketchUp.Log,
    MyFunction: SketchUp.MyFunction
}