﻿Test = {
}

var handHolder;

// Helpers
var deviceHelper;
var isLeap;

// Object Status
var isOrbiting = false;
var isPinching = false;

// Asset Status
var selectedAsset = null;

var baseBoneRotation;

var boneMaterial;
var phalanges = {};
var knuckles = {};
var sizeKnuck = 1;
var sizePhal = 0.8;

var leftHandMesh;
var rightHandMesh;
var minsAndMaxes;

ActionToFunctionMapping = {
    "Bridge": Test,
    "ActionMappings": [{
        Topic: "Ready",
        Source: "Efficio",
        Action: function (data) {
            viewer3D.navigation.setPosition(startPosition);
            viewer3D.navigation.setTarget(startTarget);

            CadHelper = new EfficioAutoCADHelper(viewer3D);
            minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();

            isLeap = Efficio.Configuration.Devices.LeapMotion;

            if (isLeap) {
                deviceHelper = Efficio.DeviceManager.RegisteredDevices.LeapMotion.Helper;
            }
            else {
                deviceHelper = Efficio.DeviceManager.RegisteredDevices['Intel RealSense'].Helper;
            }

            minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();

            baseBoneRotation = (new THREE.Quaternion).setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));

            appReady = true;
        }
    },
	{
	    Topic: "Leap",
	    Source: "Input.Raw.Human",
	    Action: function (data) {
	        DrawHand(data.Hands, data.Frame);
	    }
	}, {
	    Topic: "RealSense",
	    Source: "Input.Raw.Human",
	    Action: function (data) {
	        DrawHand(data.Hands);
	    }
	}, {
	    Topic: "RightHandThumbIndexPinch",
	    Source: "Input.Processed.Efficio",
	    ExecutionPrerequisite: function () {
	        return selectedAsset == null && !isOrbiting;
	    },
	    Action: function (data) {
	        var appAdjustedPinchLocation = AdjustCoordinatesForPinch(data);

	        var testFragment = CadHelper.AssetManagement.GetClosestFragmentToPoint(appAdjustedPinchLocation);

	        //selectedAsset = testFragment.Fragment;
	        selectedAsset = viewer3D.impl.getFragmentProxy(viewer3D.model, 10)
	        //CadHelper.Tools.Model.IsolateObjectByFragmentId(selectedAsset.fragId);
	        //CadHelper.Tools.Model.AddAxisToFragment(selectedAsset);
	        isPinching = true;
	    }
	},
    {
        Topic: "RightHandThumbIndexPinch",
        Source: "Input.Processed.Efficio",
        ExecutionPrerequisite: function () {
            return selectedAsset != null// && isPinching;
        },
        Action: function (data) {
            var appAdjustedPinchLocation = AdjustCoordinatesForPinch(data);

            ////CorrectCoordinates(appAdjustedPinchLocation);

            //CadHelper.AssetManagement.Transformer.Rotate( selectedAsset, axis, degree );
            CadHelper.AssetManagement.Transformer.Translate(selectedAsset, appAdjustedPinchLocation);
            setTimeout(function () { isPinching = false; }, 200);
        }
    }
    ],
}

function DrawHand(hands, frame) {
    if (!(typeof (rightHandMesh) === "undefined"))
        removeMeshes(rightHandMesh);
    if (!(typeof (leftHandMesh) === "undefined"))
        removeMeshes(leftHandMesh);

    var lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    var skinMat = new THREE.MeshPhongMaterial({ color: 0xA28857 });

    var knuckleGeo = new THREE.SphereGeometry(4.5, 16, 24);
    var boneGeo = new THREE.CylinderGeometry(3.7, 3.7, 1, 24);
    boneGeo.applyMatrix(new THREE.Matrix4().makeRotationX(0.5 * Math.PI));

    for (var hand of hands) {
        var side = hand.GetSide();
        if (side === "Left") {
            leftHandMesh = []
        }
        else {
            rightHandMesh = []
        }

        createBoneMeshFromHand(hand, knuckleGeo, skinMat, boneGeo, skinMat, side == "Left" ? leftHandMesh : rightHandMesh, frame)
        createMeshes(side === "Left" ? leftHandMesh : rightHandMesh);
    }

    //for (var hand of hands)
    //{
    //    for(var joint of hand.Joints()) {
    //        var scenePoint = AdjustCoordinatesForScene(joint.positionWorld);
    //        var mesh = new THREE.Mesh(knuckleGeometry, knuckleMaterial);

    //        var vertex = new THREE.Vector3().fromArray(scenePoint);

    //        mesh.position.copy(vertex);
    //        handHolder.add(mesh);
    //    }
    //}
}

function AdjustCoordinatesForPinch(data) {
    var frame = null;

    if (isLeap) {
        frame = data.Input.Frame;
    }

    var appAdjustedPinchLocation = AdjustCoordinatesForScene(data.GestureInformation.PinchMidpoint, frame);

    return appAdjustedPinchLocation;
}

function AdjustCoordinatesForScene(positionArray, frame) {
    var appAdjustedLocation = deviceHelper.MapPointToAppCoordinates(frame, positionArray, minsAndMaxes.Minimums, minsAndMaxes.Maximums);

    if (!isLeap) {
        appAdjustedLocation[0] = -appAdjustedLocation[0];
    }
    else {
        var tempZ = appAdjustedLocation[2];
        appAdjustedLocation[2] = appAdjustedLocation[1];
        appAdjustedLocation[1] = -tempZ;
    }

    if (isLeap) {
        appAdjustedLocation[0] += 15;
        appAdjustedLocation[1] += -30;
        appAdjustedLocation[2] += -10;
    }
    else {
        appAdjustedLocation[0] += 0;
        appAdjustedLocation[1] += -30;
        appAdjustedLocation[2] += 15;
    }

    return appAdjustedLocation;
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

function createMeshes(parentObject) {
    for (var mesh of parentObject)
		CadHelper.AssetManagement.CreateAsset(mesh);
}

function removeMeshes(parentObject) {
    while (mesh = parentObject.pop()) {
        CadHelper.AssetManagement.RemoveAsset(mesh);
    }
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

function createBoneMeshFromHand(theHand, knuckleGeometry, knuckleMaterial, boneGeometry, boneMaterial, fullHandMesh, frame) {
    var fingers = theHand.Fingers();

    for (var j = 0; j < fingers.length; j++) {

        var positions = null;
        var finger = fingers[j];

        if (isLeap) {
            positions = GetFingerPositionsForLeap(finger);
        } else {
            positions = GetFingerPositionsForRealSense(theHand, finger);
        }

        var geometryLine = new THREE.Geometry();
        var vertices = geometryLine.vertices;

        for (var k = 0; k < 5; k++) {
            var vertex = new THREE.Vector3().fromArray(AdjustCoordinatesForScene(positions[k], frame));

            var mesh = new THREE.Mesh(knuckleGeometry, knuckleMaterial);
            mesh.position.copy(vertex);
            fullHandMesh.push(mesh);

            if (k < 4) {
                var next = new THREE.Vector3().fromArray(AdjustCoordinatesForScene(positions[k + 1], frame));
                var d = vertex.distanceTo(next);

                mesh = new THREE.Mesh(boneGeometry, boneMaterial);
                mesh.scale.set(1, 1, d || 1);
                mesh.position.lerpVectors(vertex, next, 0.5);
                mesh.lookAt(vertex);

                fullHandMesh.push(mesh);

            }
        }
    }
}

function GetFingerPositionsForLeap(finger) {
    return finger.positions;
}

function GetFingerPositionsForRealSense(hand, finger) {
    var positions = [];

    switch (finger.tipJoint) {
        case 5: {
            positions[0] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_THUMB_TIP].positionWorld;
            positions[1] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_THUMB_JT2].positionWorld;
            positions[2] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_THUMB_JT1].positionWorld;
            positions[3] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_THUMB_BASE].positionWorld
            break;
        }
        case 9: {
            positions[0] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_INDEX_TIP].positionWorld;
            positions[1] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_INDEX_JT2].positionWorld;
            positions[2] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_INDEX_JT1].positionWorld;
            positions[3] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_INDEX_BASE].positionWorld
            break;
        }
        case 13: {
            positions[0] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_MIDDLE_TIP].positionWorld;
            positions[1] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_MIDDLE_JT2].positionWorld;
            positions[2] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_MIDDLE_JT1].positionWorld;
            positions[3] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_MIDDLE_BASE].positionWorld
            break;
        }
        case 17: {
            positions[0] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_RING_TIP].positionWorld;
            positions[1] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_RING_JT2].positionWorld;
            positions[2] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_RING_JT1].positionWorld;
            positions[3] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_RING_BASE].positionWorld
            break;
        }
        case 21: {
            positions[0] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_PINKY_TIP].positionWorld;
            positions[1] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_PINKY_JT2].positionWorld;
            positions[2] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_PINKY_JT1].positionWorld;
            positions[3] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_PINKY_BASE].positionWorld
            break;
        }
    }

    positions[4] = hand.trackedJoints[intel.realsense.hand.JointType.JOINT_CENTER].positionWorld

    positions = positions.map(function (vector) {
        return [vector.x * 1000, vector.y * 1000, vector.z * 1000];
    });

    return positions;
}

function GetMinsAndMaxes() {
    if (typeof (minsAndMaxes) === "undefined")
        minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();

    return minsAndMaxes;
}

