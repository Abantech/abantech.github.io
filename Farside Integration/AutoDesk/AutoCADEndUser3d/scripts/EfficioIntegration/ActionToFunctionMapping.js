﻿Test = {
}

var sphereCreated = false;
var bothHandsNeutral = false;
var leapHelper;

var ready = false;

var selectedAsset = null;
var controls;

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

            CadHelper = new EfficioAutoCADHelper(viewer3D);
            leapHelper = Efficio.DeviceManager.RegisteredDevices.LeapMotion.Helper;

            require(['leap-plugins', 'riggedHand'], function () {
                Efficio.DeviceManager.RegisteredDevices.LeapMotion.Device.use('transform', {
                    effectiveParent: viewer3D.impl.scene,
                });
            });

            baseBoneRotation = (new THREE.Quaternion).setFromEuler(new THREE.Euler(0, 0, Math.PI / 2))

            viewer3D.setProgressiveRendering(false);
            viewer3D.setGroundReflection(false);
            viewer3D.setGroundShadow(false);

            viewer3D.loadExtension('Autodesk.VR');

            viewer3D.setActiveNavigationTool('vr');

            viewer3D.displayViewCube(false);

            var vsmd = new Autodesk.Viewing.ApplicationScreenModeDelegate(viewer3D);
            vsmd.viewer.toolbar.setVisible(false)
            //Efficio.EventManager.RaiseEvent('MyNewEvent', { myData1: 1, myData2: 2 })
            ready = true;
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
        Topic: "RightHandPronation",
        Source: "Input.Processed.Efficio",
        ExecutionPrerequisite: function () {
            return !(CadHelper.Tools.Navigation.GetActiveNavigationTool() === 'dolly');
        },
        Action: function (data) {
            CadHelper.Tools.Navigation.SetActiveNavigationTool('dolly');
        }
    },
    {
        Topic: "RightHandPronation",
        Source: "Input.Processed.Efficio",
        ExecutionPrerequisite: function () {
            return CadHelper.Tools.Navigation.GetActiveNavigationTool() === 'dolly';
        },
        Action: function (data) {
            if (data.GestureInformation.EndPosition) {
                var zoomAmount = 2;

                var changeZ = data.GestureInformation.StartPosition[2] - data.GestureInformation.EndPosition[2];

                changeZ = changeZ > 50 ? 50 : changeZ;
                changeZ = changeZ < -50 ? -50 : changeZ;

                if (changeZ > 0) {
                    CadHelper.Navigation.Zoom.ZoomIn(zoomAmount * (changeZ / 50));
                }
                else {
                    CadHelper.Navigation.Zoom.ZoomOut(zoomAmount * ((-1 * changeZ) / 50));
                }
            }
        }
    },
    {
        Topic: "RightHandThumbIndexPinch",
        Source: "Input.Processed.Efficio",
        ExecutionPrerequisite: function () {	
            return selectedAsset == null;
        },
        Action: function (data) {
            var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();
            var appAdjustedPinchLocation = leapHelper.MapPointToAppCoordinates(data.Input.Frame, data.GestureInformation.PinchMidpoint, minsAndMaxes.Minimums, minsAndMaxes.Maximums);

            CorrectCoordinates(appAdjustedPinchLocation);

            var testFragment = CadHelper.AssetManagement.GetClosestFragmentToPoint(appAdjustedPinchLocation);

            //selectedAsset = testFragment.Fragment;
            selectedAsset = CadHelper.AssetManagement.GetFragmentById(10);
        }
    },
    {
        Topic: "RightHandThumbIndexPinch",
        Source: "Input.Processed.Efficio",
        ExecutionPrerequisite: function () {
            return selectedAsset != null;
        },
        Action: function (data) {
            var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();
            var appAdjustedPinchLocation = leapHelper.MapPointToAppCoordinates(data.Input.Frame, data.GestureInformation.PinchMidpoint, minsAndMaxes.Minimums, minsAndMaxes.Maximums);

            CorrectCoordinates(appAdjustedPinchLocation);

            CadHelper.AssetManagement.Transformer.Translate(selectedAsset, appAdjustedPinchLocation);
        }
    },

        // {
        //    Topic: "RightHandThumbIndexPinch",
        //    Source: "Input.Processed.Efficio",
        //    Action: function (data) {
        //        var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();
        //        var appAdjustedPinchLocation = leapHelper.MapPointToAppCoordinates(data.Input.Frame, data.GestureInformation.PinchMidpoint, minsAndMaxes.Minimums, minsAndMaxes.Maximums);

        //        var testFragment = CadHelper.AssetManagement.GetClosestFragmentToPoint(appAdjustedPinchLocation);

        //        viewer3D.isolate(viewer3D.model.getData().fragments.fragId2dbId[testFragment.Fragment.fragId]);
        //    }
    //},
     {
         Topic: "MyNewEvent",
         Source: "Event Manager",
         Action: function (data) {
             alert(JSON.stringify(data));
         }
     },
     {
         Topic: "RawOrientationData",
         Source: "Input.Processed.Efficio.Device",
         Action: function (data) {
             //if (ready) {
             //    if (!controls) {
             //        controls = new THREE.DeviceOrientationControls();
             //    }

             //    controls.onDeviceOrientationChangeEvent(data.Input.DeviceOrientation);

             //    var fragments = viewer3D.model.getData().fragments;

             //    for (var i = 0; i < fragments.length; i++) {
             //        viewer3D.impl.getFragmentProxy(viewer3D.model, i).getAnimTransform();
             //        var mesh = viewer3D.impl.getRenderProxy(viewer3D.model, i);
             //        mesh.rotation.reorder("YXZ");
             //        controls.update(mesh);
             //        viewer3D.impl.getFragmentProxy(viewer3D.model, i).updateAnimTransform();
             //    }
             //}
         }
     },
            //{
            //    Topic: "RightHandZeroFingersExtended",
            //    Source: "Input.Processed.Efficio",
            //    ExecutionPrerequisite: function () {
            //        return CadHelper.Tools.Navigation.GetActiveNavigationTool() === 'pan';
            //    },
            //    Action: function (data) {
            //        if (data.GestureInformation.EndPosition) {
            //            var panAmount = 2;

            //            var changeX = data.GestureInformation.StartPosition[0] - data.GestureInformation.EndPosition[0];

            //            changeX = changeX > 50 ? 50 : changeX;
            //            changeX = changeX < -50 ? -50 : changeX;


            //            if (changeX > 0) {
            //                CadHelper.Navigation.Panning.PanRight(panAmount * (changeX / 50));
            //            }
            //            else {
            //                CadHelper.Navigation.Panning.PanLeft(panAmount * ((-1 * changeX) / 50));
            //            }
            //        }
            //    }
            //},
            //{
            //    Topic: "RightHandZeroFingersExtended",
            //    Source: "Input.Processed.Efficio",
            //    ExecutionPrerequisite: function () {
            //        return CadHelper.Tools.Navigation.GetActiveNavigationTool() === 'orbit';
            //    },
            //    Action: function (data) {
            //        if (data.GestureInformation.EndPosition) {
            //            var rotateAmount = .1;

            //            var changeX = data.GestureInformation.StartPosition[0] - data.GestureInformation.EndPosition[0];

            //            changeX = changeX > 50 ? 50 : changeX;
            //            changeX = changeX < -50 ? -50 : changeX;

            //            if (changeX > 0) {
            //                CadHelper.Navigation.Rotation.RotateClockwise(rotateAmount * (changeX / 50));
            //            }
            //            else {
            //                CadHelper.Navigation.Rotation.RotateCounterClockwise(rotateAmount * ((-1 * changeX) / 50));
            //            }
            //        }
            //    }
            //},
             //{
             //    Topic: "RightHandZeroFingersExtended",
             //    Source: "Input.Processed.Efficio",
             //    ExecutionPrerequisite: function () {
             //        return CadHelper.Tools.Navigation.GetActiveNavigationTool() === 'dolly';
             //    },
             //    Action: function (data) {
             //        if (data.GestureInformation.EndPosition) {
             //            var zoomAmount = 2;

             //            var changeZ = data.GestureInformation.StartPosition[2] - data.GestureInformation.EndPosition[2];

             //            changeZ = changeZ > 50 ? 50 : changeZ;
             //            changeZ = changeZ < -50 ? -50 : changeZ;

             //            if (changeZ > 0) {
             //                CadHelper.Navigation.Zoom.ZoomIn(zoomAmount * (changeZ / 50));
             //            }
             //            else {
             //                CadHelper.Navigation.Zoom.ZoomOut(zoomAmount * ((-1 * changeZ) / 50));
             //            }
             //        }
             //    }
             //},
            //{
            //    Topic: "BothHandsNeutral",
            //    Source: "Input.Processed.Efficio",
            //    Action: function (data) {
            //        bothHandsNeutral = true;

            //        var explodeFactor = (data.GestureInformation.DistanceX - 100) / data.Input.Frame.interactionBox.width
            //        if (explodeFactor > 1) {
            //            explodeFactor = 1;
            //        }

            //        viewer3D.explode(explodeFactor);

            //        setTimeout(function () {
            //            bothHandsNeutral = false;
            //        }, 200)
            //    },
            //    FireRestrictions: {
            //        FireAfterXFrames: 15
            //    }
            //},
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
        'Create Sphere': function () { CreateSpheres(); },
        'Navigation :tool': function (tool) { CadHelper.Tools.Navigation.SetActiveNavigationTool(tool); },
        'Select *part': function (part) { CadHelper.Tools.Model.SelectObject(part) },
        'Isolate *part': function (part) { CadHelper.Tools.Model.IsolateObject(part) },
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