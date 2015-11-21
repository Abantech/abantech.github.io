var bus = require('postal');

if (typeof THREE === 'undefined') {
    var THREE = require('three');
}

var Ammo = require('./ammo.js');
var Physijs = require('./physi.js')(THREE, Ammo);

var physicsScene

var source = 'Physics';

module.exports = {
    Initialize: function () {
        physicsScene = new Physijs.Scene();
        physicsScene.setGravity(new THREE.Vector3(0, -30, 0));
        
        bus.subscribe({
            channel: "Asset",
            topic: "*",
            callback: function (data, envelope) {
                if (envelope.source != source) {
                    switch (envelope.topic) {
                        case "Create": {
                            var mass;
                            
                            if (data.physics) {
                                mass = 1
                            } else {
                                mass = 0;
                            }
                            
                            var obj = ConvertThreeToPhysi(data.asset, mass);
                            
                            obj.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                                this.mass = 0;

                                if (other_object.previousState) {
                                    other_object.position.copy(other_object.previousState.position);
                                    other_object.quaternion.copy(other_object.previousState.quaternion);
                                    other_object.mass = 0;
                                }
                            });
                            
                            physicsScene.add(obj);
                            break;
                        }
                        case "Update": {
                            var oldAsset = physicsScene.getObjectByName(data.asset.id, true);
                            var mass = 1
                            
                            physicsScene.remove(oldAsset);
                            
                            var newAsset = ConvertThreeToPhysi(data.asset, mass);
                            newAsset.previousState = oldAsset;
                            
                            // Enable CCD if the object moves more than 1 meter in one simulation frame
                            newAsset.setCcdMotionThreshold(.1);
                            
                            // Set the radius of the embedded sphere such that it is smaller than the object
                            newAsset.setCcdSweptSphereRadius(0.2);

                            newAsset.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
                                this.position.copy(this.previousState.position);
                                this.quaternion.copy(this.previousState.quaternion);
                                this.mass = 0;

                                if (other_object.previousState) {
                                    other_object.position.copy(other_object.previousState.position);
                                    other_object.quaternion.copy(other_object.previousState.quaternion);
                                    other_object.mass = 0;
                                }
                            });

                            physicsScene.add(newAsset);
                            break;

                        }
                        case "Delete": {
                            ami.DeleteAsset(data.asset);
                            break;
                        }
                    }
                }
            }
        })
    },
    Start: function () {
        requestAnimationFrame(internalPhysicsRender);
    }
}

var internalPhysicsRender = function () {
    physicsScene.simulate(); // run physics
    
    bus.publish({
        channel: "Scene",
        topic: "Update",
        source: source,
        data: {
            assets: physicsScene.children
        }
    });
    
    requestAnimationFrame(internalPhysicsRender);
};

function ConvertThreeToPhysi(asset, mass, options) {
    var physiObject;
    
    switch (asset.geometry.type) {
        case "BoxGeometry": {
            physiObject = new Physijs.BoxMesh(asset.geometry, asset.material, mass);
            break;
        }
        case "CubeGeometry": {
            physiObject = new Physijs.BoxMesh(asset.geometry, asset.material, mass);
            break;
        }
        case "SphereGeometry": {
            physiObject = new Physijs.SphereMesh(asset.geometry, asset.material, mass);
            break;
        }
        case "CylinderGeometry": {
            physiObject = new Physijs.CylinderMesh(asset.geometry, asset.material, mass);
            break;
        }
    }
    
    //for (key in asset) {
    //    if (key != 'mesh' && key != 'geometry' && key != 'parent' && key != 'children') {
    //        physiObject[key] = asset[key];
    //    }
    //}
    
    physiObject.position.copy(asset.position);
    physiObject.quaternion.copy(asset.quaternion);
    
    physiObject.name = asset.id;
    
    asset.children.forEach(function (child) {
        physiObject.add(ConvertThreeToPhysi(child));
    });
    
    return physiObject;
}