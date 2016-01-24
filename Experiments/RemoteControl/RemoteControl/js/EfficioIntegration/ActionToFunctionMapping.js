Test = {
}

ActionToFunctionMapping = {
    "Bridge": Test,
    "ActionMappings": [{
        Topic: "Leap",
        Source: "Input.Raw.Human",
        Action: function (data) {
            if (typeof renderer !== 'undefined') {
                var countBones = 0;
                var countArms = 0;

                armMeshes.forEach(function (item) { scene.remove(item) });
                boneMeshes.forEach(function (item) { scene.remove(item) });

                for (var hand of data.Input.hands) {

                    for (var finger of hand.fingers) {

                        for (var bone of finger.bones) {

                            if (countBones++ === 0) { continue; }

                            var boneMesh = boneMeshes[countBones] || addMesh(boneMeshes);
                            updateMesh(bone, boneMesh);

                        }

                    }

                    var arm = hand.arm;
                    var armMesh = armMeshes[countArms++] || addMesh(armMeshes);
                    updateMesh(arm, armMesh);
                    armMesh.scale.set(arm.width / 4, arm.width / 2, arm.length);

                }

                renderer.render(scene, camera);
                controls.update();
            }
        }
    }]
}

AudioCommands = {
	"Toggle Snapping": function(){
		viewer3D.navigation.snapping = !viewer3D.navigation.snapping;
	}
}

function GetIntermeditatePoints(start, end, factor) {
    var x = start.x + ((end.x - start.x) * factor);
    var y = start.y + ((end.y- start.y) * factor);
    var z = start.z + ((end.z - start.z) * factor);

    return new THREE.Vector3(x, y, z);
}