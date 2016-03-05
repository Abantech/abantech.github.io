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

var hands, hand;
var boneMaterial;
var phalanges = {};
var knuckles = {};
var sizeKnuck = 1;
var sizePhal = 0.8;

function GetBoneMaterial()
{
    if ( typeof ( boneMaterial ) == "undefined" )
    {
        var material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color( 1, 1, 1 );
        material.transparent = true;
        material.opacity = 0.7;
        boneMaterial = material;
    }

    return boneMaterial;
}

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

                for ( p in phalanges )
                {
                    CadHelper.AssetManagement.RemoveAsset( phalanges[p] );
                    delete phalanges[p]
                }

                for ( k in knuckles )
                {
                    CadHelper.AssetManagement.RemoveAsset( knuckles[k] );
                    delete knuckles[k]
                }
            }

            for ( var hand of data.Hands )
            {
                for ( var finger of hand.fingers ) {
                    updatePhalange( data.Frame, finger.distal, finger.carpPosition, 0.3 )
                    updatePhalange( data.Frame, finger.medial, finger.dipPosition, 0.325 )
                    updatePhalange( data.Frame, finger.proximal, finger.pipPosition, 0.35 )
                    updatePhalange( data.Frame, finger.metacarpal, finger.mcpPosition, 0.375 )
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

function getPhalange(bone)
{
    var boneName = GetBoneName( bone );
    var phalangeMesh;

    if ( boneName in phalanges )
    {
        phalange = phalanges[boneName]
    }
    else
    {
        var phalangeGeometry = new THREE.CylinderGeometry( sizePhal, sizePhal, 1 );
        var phalangeMesh = new THREE.Mesh( phalangeGeometry, GetBoneMaterial() );
        phalanges[boneName] = phalangeMesh;
    }

    phalangeMesh.visible = false;

    return phalangeMesh;
}

function getKnuckle(bone)
{
    var boneName = GetBoneName( bone );
    var knuckleMesh;

    if ( boneName in knuckles )
    {
        knuckle = knuckles[boneName]
    }
    else
    {
        var knuckleGeometry = new THREE.SphereGeometry( sizeKnuck, 20, 10 );
        var knuckleMesh = new THREE.Mesh( knuckleGeometry, GetBoneMaterial());
        knuckles[boneName] = knuckleMesh;
    }

    knuckleMesh.visible = false;

    return knuckleMesh;
}

function GetBoneName(bone)
{
    var handType = bone.finger.frame.hands.find( function ( h ) { return h.id === bone.finger.handId; } ).type;
    return handType + "hand-" + bone.finger.GetFingerLabel() + "-" + bone.type;
}

function updatePhalange( frame, bone, position, scale)
{
    var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();

    if ( !( bone.type == 0 && bone.length == 0 ) )
    {
        var phalange = getPhalange( bone );
        
        var normalizedCenter = leapHelper.MapPointToAppCoordinates( frame, bone.center(), minsAndMaxes.Minimums, minsAndMaxes.Maximums );

        phalange.position.fromArray( normalizedCenter );
        phalange.scale.y = bone.length;
        phalange.scale.set( scale * bone.width, bone.length, scale * bone.width );
        var d = bone.direction();
        phalange.quaternion.setFromUnitVectors( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( d[0], d[1], d[2] ) );
        phalange.visible = true;
        CadHelper.AssetManagement.CreateAsset( phalange );
    }

    var knuckle = getKnuckle( bone )
    var s = 1.15 * scale * bone.width;
    knuckle.position.fromArray( leapHelper.MapPointToAppCoordinates( frame, position, minsAndMaxes.Minimums, minsAndMaxes.Maximums ) );
    knuckle.scale.set( s, s, s );
    knuckle.visible = true;
    CadHelper.AssetManagement.CreateAsset( knuckle );
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