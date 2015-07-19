var bus = require('postal');
var THREE = require('three');

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

                            var box = new Physijs.BoxMesh(data.asset.geometry, data.asset.material, mass);
                            box.name = data.asset.id;
                            box.position.copy(data.asset.position);
                            
                            physicsScene.add(box);
                            break;
                        }
                        case "Update": {
                            var oldAsset = physicsScene.getObjectById(asset.id);
                            
                            physicsScene.remove(oldAsset);
                            physicsScene.add(asset);
                            
                            asset = physicsScene.getObjectById(asset.id);
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
        requestAnimationFrame(render);
    }
}

render = function () {
    physicsScene.simulate(); // run physics
    
    bus.publish({
        channel: "Scene",
        topic: "Update",
        source: source,
        data: {
            assets: physicsScene.children
        }
    });
    
    requestAnimationFrame(render);
};