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

var phalanges;
var knuckles;

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

            /*
            var material = new THREE.MeshPhongMaterial();
            material.color = new THREE.Color( 1, 1, 1 );
            material.transparent = true;
            material.opacity = 0.7;

            initHands(material, 1.1, 1);
            */
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
               
                while ( boneMeshes.length > 0 )
                {
                    CadHelper.AssetManagement.RemoveAsset(boneMeshes.pop());
                }
                 /*
                while (phalanges.children.length > 0)
                {
                    CadHelper.AssetManagement.RemoveAsset( phalanges.children.pop() );
                }

                while ( knuckles.children.length > 0 )
                {
                    CadHelper.AssetManagement.RemoveAsset( knuckles.children.pop() );
                }
                */
            }

            //updateHand( data.Frame );

            
            for ( var hand of data.Hands )
            {
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
        Action: function ( data )
        {
            //console.log( "AIRPLANE MODE DETECTED!" )

            if ( data.GestureInformation.EndPosition )
            {
				//Zooming functions
                var zoomAmount = 1;

                var changeZ = data.GestureInformation.StartPosition[2] - data.GestureInformation.EndPosition[2];

                changeZ = changeZ > 50 ? 50 : changeZ;
                changeZ = changeZ < -50 ? -50 : changeZ;

                if ( changeZ > 0 )
                {
                    CadHelper.Navigation.Zoom.ZoomIn( zoomAmount * ( changeZ / 50 ) );
                }
                else
                {
                    CadHelper.Navigation.Zoom.ZoomOut( zoomAmount * ( ( -1 * changeZ ) / 50 ) );
                }

				//Panning functions
				var panAmount = 0.5;

				var changeX = data.GestureInformation.StartPosition[0] - data.GestureInformation.EndPosition[0];

				changeX = changeX > 50 ? 50 : changeX;
				changeX = changeX < -50 ? -50 : changeX;

				if (changeX > 0) 
				{
					CadHelper.Navigation.Panning.PanRight(panAmount * (changeX / 50));
				}
				else 
				{
					CadHelper.Navigation.Panning.PanLeft(panAmount * ((-1 * changeX) / 50));
				}
			}
        }
    },
	{
        Topic: "RightHandThumbIndexPinch",
        Source: "Input.Processed.Efficio",
		ExecutionPrerequisite: function () {	
            return selectedAsset == null && !isOrbiting;
        },		
        Action: function (data) {
            var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();
            var appAdjustedPinchLocation = leapHelper.MapPointToAppCoordinates(data.Input.Frame, data.GestureInformation.PinchMidpoint, minsAndMaxes.Minimums, minsAndMaxes.Maximums);

            CorrectCoordinates(appAdjustedPinchLocation);

            var testFragment = CadHelper.AssetManagement.GetClosestFragmentToPoint(appAdjustedPinchLocation);

            selectedAsset = testFragment.Fragment;
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
			var axis = data.GestureInformation.axis;
			var degree = data.GestureInformation.degree;
            var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();
            var appAdjustedPinchLocation = leapHelper.MapPointToAppCoordinates(data.Input.Frame, data.GestureInformation.PinchMidpoint, minsAndMaxes.Minimums, minsAndMaxes.Maximums);

            //CorrectCoordinates(appAdjustedPinchLocation);

            //var testFragment = CadHelper.AssetManagement.GetClosestFragmentToPoint(appAdjustedPinchLocation);

            //selectedAsset = testFragment.Fragment;
            //CadHelper.Tools.Model.IsolateObjectByFragmentId(selectedAsset.fragId);
            //CadHelper.Tools.Model.AddAxisToFragment(selectedAsset);
			CadHelper.AssetManagement.Transformer.Rotate(selectedAsset, axis, degree);
            CadHelper.AssetManagement.Transformer.Translate(selectedAsset, appAdjustedPinchLocation);
			setTimeout(function() { isPinching = false; }, 200);
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

function initHands(material, sizePhal, sizeKnuck)
{
    phalanges = new THREE.Object3D();
    knuckles = new THREE.Object3D();

    phalanges.scale.x = knuckles.scale.x = 1;
    phalanges.scale.y = knuckles.scale.y = 1;
    phalanges.scale.z = knuckles.scale.z = 1;

    for ( var i = 0; i < 38; i++ )
    {
        var geometry = new THREE.CylinderGeometry( sizePhal, sizePhal, 1 );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = true
        mesh.receiveShadow = true;
        mesh.visible = false;
        phalanges.add( mesh );

        geometry = new THREE.SphereGeometry(sizeKnuck, 20, 10 );
        mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = true
        mesh.receiveShadow = true;
        mesh.visible = false;
        knuckles.add( mesh );
    }
}

function updateHand(frame)
{
    if ( !appReady )
        return;

    var count = 0;

    for ( var i = 0; i < frame.hands.length; i++ )
    {
        var hand = frame.hands[i];

        for ( var j = 0; j < hand.fingers.length; j++ )
        {
            var f = hand.fingers[j];
            updateFinger( count++, f.distal, f.carpPosition, 0.3 );
            updateFinger( count++, f.medial, f.dipPosition, 0.325 );
            updateFinger( count++, f.proximal, f.pipPosition, 0.35 );
            updateFinger( count++, f.metacarpal, f.mcpPosition, 0.375 );
        }

    }

    for ( var i = 0; i < frame.pointables.length; i++ )
    {
        var currentCount = count++;
        if ( currentCount < knuckles.children.length )
        {
            var k = knuckles.children[count++];
            k.position.fromArray( frame.pointables[i].tipPosition );
            k.visible = true;
        }
    }

    for ( var i = count; i < 38; i++ )
    {
        phalanges.children[i].visible = false;
        knuckles.children[i].visible = false;
    }
}

function updateFinger( count, bone, position, scale )
{
    if (bone.finger.GetFingerLabel() != "Thumb")
    { // thumbs have no metacarpals

        var p = phalanges.children[count];
        p.position.fromArray( bone.center() );
        p.scale.y = bone.length;
        p.scale.set( scale * bone.width, bone.length, scale * bone.width );

        var d = bone.direction();
        p.quaternion.setFromUnitVectors( new THREE.Vector3(0,1,0), new THREE.Vector3( d[0], d[1], d[2] ) );
        p.visible = true;
        CadHelper.AssetManagement.CreateAsset( p );
    }

    if ( count < knuckles.children.length )
    {
        var k = knuckles.children[count];
        var s = 1.15 * scale * bone.width;
        k.position.fromArray( position );
        k.scale.set( s, s, s );
        k.visible = true;

        CadHelper.AssetManagement.CreateAsset( k );
    }
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