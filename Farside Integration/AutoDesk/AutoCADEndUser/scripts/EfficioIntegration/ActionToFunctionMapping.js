Test = {
}
var sphereCreated = false;
var bothHandsNeutral = false;
var myMesh = null;

var baseBoneRotation;
var armMeshes = [];
var boneMeshes = [];

ActionToFunctionMapping = {
    "Bridge": Test,
    "ActionMappings": [{
        Topic: "Ready",
        Source: "Efficio",
        Action: function (data) {
            viewer3D.navigation.setPosition(startPosition);
            viewer3D.navigation.setTarget(startTarget);
            appReady = true;

            CadHelper = new EfficioAutoCADHelper();
            CadHelper.Initialize(viewer3D);
            CreateSpheres()

            baseBoneRotation = (new THREE.Quaternion).setFromEuler(new THREE.Euler(0, 0, Math.PI / 2))
        }
    }, {
        Topic: "Leap",
        Source: "Input.Raw.Human",
        Action: function (data) {
            var countBones = 0;
            var countArms = 0;

            if (data.Controller.frame(1).hands.length > 0) {
                armMeshes.forEach(function (item) { CadHelper.AssetManagement.RemoveAsset(item) });
                boneMeshes.forEach(function (item) { CadHelper.AssetManagement.RemoveAsset(item) });
            }

            for (var hand of data.Frame.hands) {

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
        }
    },{
        Topic: "RightHandThumbIndexPinch",
        Source: "Input.Processed.Efficio",
        Action: function (data) {
            // get Leap Helper
            var leapHelper = Efficio.DeviceManager.RegisteredDevices.LeapMotion.Helper;

            // Normalize Leap Input
            var normalizedPinchPoint = leapHelper.NormalizePoint(data.Input.Frame, data.GestureInformation.PinchMidpoint);

            var testFragment = CadHelper.AssetManagement.GetClosestFragmentToPoint(data.GestureInformation.PinchMidpoint);

            // Get Scene mins and maxes
            var boundingBox = viewer3D.model.getBoundingBox();
            var maxpt = boundingBox.max;
            var minpt = boundingBox.min;

            // Get Scene Point
            var scenePinchPoint = leapHelper.MapNormalizedPointToAppCoordinates(normalizedPinchPoint, [minpt.x, minpt.y, minpt.z], [maxpt.x, maxpt.y, maxpt.z]);
        }
    },
        //{
        //    Topic: "RightHandZeroFingersExtended",
        //    Source: "Input.Processed.Efficio",
        //    Action: function (data) {
        //        if (data.GestureInformation.EndPosition) {
        //            var changeX = data.GestureInformation.StartPosition[0] - data.GestureInformation.EndPosition[0];

        //            changeX = changeX > 50 ? 50 : changeX;
        //            changeX = changeX < -50 ? -50 : changeX;

        //            if (changeX > 0) {
        //                CadHelper.Navigation.Panning.PanRight(2 * (Math.abs(changeX) / 50));
        //            }
        //            else {
        //                CadHelper.Navigation.Panning.PanLeft(2 * (Math.abs(changeX) / 50));
        //            }
        //        }

        //        for (var i = 0; i < 100; i++) {
        //            var frag = viewer3D.impl.getFragmentProxy(viewer3D.model, i);

        //            CadHelper.AssetManagement.Transformer.Translate(frag, new THREE.Vector3(-100, -100, -100));
        //            CadHelper.AssetManagement.Transformer.Scale(frag, new THREE.Vector3(2, 2, 2));
        //            CadHelper.AssetManagement.Transformer.Rotate(frag, new THREE.Vector3(0, 0, 1), 90);

        //        }

        //    }
        //},
	{
	    Topic: "BothHandsNeutral",
	    Source: "Input.Processed.Efficio",
	    Action: function (data) {
	        bothHandsNeutral = true;

	        var explodeFactor = (data.GestureInformation.DistanceX - 100) / data.Input.Input.interactionBox.width
	        if (explodeFactor > 1) {
	            explodeFactor = 1;
	        }

	        viewer3D.explode(explodeFactor);

	        setTimeout(function () {
	            bothHandsNeutral = false;
	        }, 200)
	    },
	    FireRestrictions: {
	        FireAfterXFrames: 15
	    }
	},
	//{
	//    Topic: "RightHandUlnarDeviation",
	//    Source: "Input.Processed.Efficio",
	//    Action: function (data) {
	//        if (!bothHandsNeutral) {
	//            //CadHelper.Navigation.Rotation.RotateClockwise(.05);
	//            var test = CadHelper.AssetManagement.GetAssetByID(myMesh.id);
	//            test.translateX(10);
	//            CadHelper.AssetManagement.UpdateScene();
	//        }
	//    }
	//},
    //{
    //    Topic: "RightHandRadialDeviation",
    //    Source: "Input.Processed.Efficio",
    //    Action: function (data) {
    //        if (!bothHandsNeutral) {
    //            //CadHelper.Navigation.Rotation.RotateCounterClockwise(.05);
    //            var test = CadHelper.AssetManagement.GetAssetByID(myMesh.id);
    //            test.translateX(-10);
    //            CadHelper.AssetManagement.UpdateScene();
    //        }
    //    }
    //},
	//{
	//    Topic: "LeftHandUlnarDeviation",
	//    Source: "Input.Processed.Efficio",
	//    Action: function (data) {
	//        if (!bothHandsNeutral) {
	//            CadHelper.Navigation.Zoom.ZoomIn(2);
	//        }
	//    }
	//},
    //{
    //    Topic: "LeftHandRadialDeviation",
    //    Source: "Input.Processed.Efficio",
    //    Action: function (data) {
    //        if (!bothHandsNeutral) {
    //            CadHelper.Navigation.Zoom.ZoomOut(2);
    //        }
    //    }
    //}
    ],
    AudioCommands: {
        'Create Sphere': function () { CreateSpheres(); }
    }
}



function CreateSpheres() {
    //create material red
    var material_red =
        new THREE.MeshPhongMaterial(
                  { color: 0xff0000 });

    //get bounding box of the model
    var boundingBox =
        viewer3D.model.getBoundingBox();
    var maxpt = boundingBox.max;
    var minpt = boundingBox.min;

    var xdiff = maxpt.x - minpt.x;
    var ydiff = maxpt.y - minpt.y;
    var zdiff = maxpt.z - minpt.z;

    //set a nice radius in the model size
    var niceRadius =
               Math.pow((xdiff * xdiff +
                         ydiff * ydiff +
                         zdiff * zdiff), 0.5) / 10;

    //createsphere1 and place it at max point of boundingBox
    var sphere_maxpt =
         new THREE.Mesh(
                new THREE.SphereGeometry(
                          niceRadius, 20),
                material_red);
    sphere_maxpt.position.set(maxpt.x,
                              maxpt.y,
                              maxpt.z);

    myMesh = sphere_maxpt;

    CadHelper.AssetManagement.CreateAsset(sphere_maxpt);
}

function MoveCameraByPercentage(explodeFactor) {
    viewer3D.navigation.setPosition(GetIntermeditatePoints(startPosition, endPosition, explodeFactor));
    viewer3D.navigation.setTarget(GetIntermeditatePoints(startTarget, endTarget, explodeFactor));
}

function GetIntermeditatePoints(start, end, factor) {
    var x = start.x + ((end.x - start.x) * factor);
    var y = start.y + ((end.y - start.y) * factor);
    var z = start.z + ((end.z - start.z) * factor);

    return new THREE.Vector3(x, y, z);
}

function addMesh(meshes) {

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    meshes.push(mesh);

    return mesh;

}

function updateMesh(bone, mesh) {

    mesh.position.fromArray(bone.center());
    mesh.setRotationFromMatrix((new THREE.Matrix4).fromArray(bone.matrix()));
    mesh.quaternion.multiply(baseBoneRotation);
    mesh.scale.set(bone.width, bone.width, bone.length);

    CadHelper.AssetManagement.CreateAsset(mesh);
}