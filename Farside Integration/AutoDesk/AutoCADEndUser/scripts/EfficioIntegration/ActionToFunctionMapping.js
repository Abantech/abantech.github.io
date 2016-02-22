Test = {
}

var sphereCreated = false;
var bothHandsNeutral = false;
var leapHelper;
var isOrbiting = false;
var isPinching = false;

var selectedAsset = null;

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

            CadHelper = new EfficioAutoCADHelper(viewer3D);
            leapHelper = Efficio.DeviceManager.RegisteredDevices.LeapMotion.Helper;

            //require(['leap-plugins', 'riggedHand'], function () {
            //    Efficio.DeviceManager.RegisteredDevices.LeapMotion.Device.use('transform', {
            //        effectiveParent: viewer3D.impl.scene,
            //    });
            //});

            baseBoneRotation = (new THREE.Quaternion).setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));

            appReady = true;
        }
    }, {
        Topic: "Leap",
        Source: "Input.Raw.Human",
        Action: function (data) {
            var countBones = 0;
            var countArms = 0;

            if (data.Controller.frame(1).hands.length > 0) {
                while (boneMeshes.length > 0) {
                    CadHelper.AssetManagement.RemoveAsset(boneMeshes.pop());
                }
            }

            for (var hand of data.Hands) {

                for (var finger of hand.fingers) {

                    for (var bone of finger.bones) {

                        if (countBones++ === 0) { continue; }

                        var boneMesh = boneMeshes[countBones] || addMesh(boneMeshes);
                        updateMesh(data.Frame, bone, boneMesh);


                    }

                }
            }
        }
    },
    {
        Topic: "RightHandAirplane",
        Source: "Input.Processed.Efficio",
        Action: function (data) {

        }
    },
    {
        Topic: "RightHandThumbIndexPinch",
        Source: "Input.Processed.Efficio",
        Action: function (data) {
            var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();
            var appAdjustedPinchLocation = leapHelper.MapPointToAppCoordinates(data.Input.Frame, data.GestureInformation.PinchMidpoint, minsAndMaxes.Minimums, minsAndMaxes.Maximums);

            CorrectCoordinates(appAdjustedPinchLocation);

            var testFragment = CadHelper.AssetManagement.GetClosestFragmentToPoint(appAdjustedPinchLocation);

            selectedAsset = testFragment.Fragment;
            CadHelper.Tools.Model.IsolateObjectByFragmentId(selectedAsset.fragId);
            CadHelper.Tools.Model.AddAxisToFragment(selectedAsset);
        }
    }
    ],
    AudioCommands: {
        'Create Sphere': function () { CreateSpheres(); },
        'Navigation :tool': function (tool) { CadHelper.Tools.Navigation.SetActiveNavigationTool(tool); },
        'Select *part': function (part) { CadHelper.Tools.Model.SelectObjectByName(part) },
        'Isolate *part': function (part) { CadHelper.Tools.Model.IsolateObjectByName(part) },
        'Clear Selection': function () { CadHelper.Tools.Model.ClearSelection(); }
    }
}

function CorrectCoordinates(position) {
    position[0] = position[0] + 15;
    position[1] = position[1] - 30;
    position[2] = position[2] - 10;
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

function updateMesh(frame, bone, mesh) {
    var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();

    // Get Scene Point
    var normalizedCenter = leapHelper.MapPointToAppCoordinates(frame, bone.center(), minsAndMaxes.Minimums, minsAndMaxes.Maximums);

    mesh.position.fromArray(normalizedCenter);
    mesh.setRotationFromMatrix((new THREE.Matrix4).fromArray(bone.matrix()));
    mesh.quaternion.multiply(baseBoneRotation);
    mesh.scale.set(bone.width / 8, bone.width / 8, bone.length / 4);

    CadHelper.AssetManagement.CreateAsset(mesh);
}