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

var leftHandMesh;
var rightHandMesh;

var leftHandVisual = new HandVisualizer(false);
var rightHandVisual = new HandVisualizer(false);

function GetAppAdjustedVector( inputVector, frame )
{
	/* BEGIN OLD CAD ADJUSTER CODE
    var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();
    var adjustedPosition = leapHelper.MapPointToAppCoordinates( frame, inputVector, minsAndMaxes.Minimums, minsAndMaxes.Maximums );
    CorrectCoordinates( adjustedPosition );
    return new THREE.Vector3().fromArray( adjustedPosition );
	END OLD CAD ADJUSTER CODE */
	return new THREE.Vector3().fromArray( inputVector );
}

ActionToFunctionMapping = {
    "Bridge": Test,
    "ActionMappings": [{
        Topic: "Ready",
        Source: "Efficio",
        Action: function ( data )
        {
            ////viewer3D.navigation.setPosition( startPosition );
            ////viewer3D.navigation.setTarget( startTarget );
            appReady = true;

            ////CadHelper = new EfficioAutoCADHelper( viewer3D );
            leapHelper = Efficio.DeviceManager.RegisteredDevices.LeapMotion.Helper;

			/*
            require( ['leap-plugins', 'riggedHand'], function ()
            {
                Efficio.DeviceManager.RegisteredDevices.LeapMotion.Device.use( 'transform', {
                    effectiveParent: viewer3D.impl.scene,
                } );
            } );
			*/
			
            //baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) )

            //Efficio.EventManager.RaiseEvent('MyNewEvent', { myData1: 1, myData2: 2 })
        }
    }, {
        Topic: "Leap",
        Source: "Input.Raw.Human",
        Action: function ( data )
        {
			/*
            if ( !( typeof ( rightHandMesh ) === "undefined" ) )
                removeMeshes( rightHandMesh );
            //CadHelper.AssetManagement.RemoveAsset( rightHandMesh );
            if ( !( typeof ( leftHandMesh ) === "undefined" ) )
                removeMeshes( leftHandMesh );
			*/
			
            var lineMat = new THREE.LineBasicMaterial( { color: 0x000000 } );
            var skinMat = new THREE.MeshPhongMaterial( { color: 0xA28857 } );

            var knuckleGeo = new THREE.SphereGeometry( 4.5, 16, 24 );
            var boneGeo = new THREE.CylinderGeometry( 3.7, 3.7, 1, 24 );
            boneGeo.applyMatrix( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

            var vectorAdjuster = function ( inputVector )
            {
                return GetAppAdjustedVector( inputVector, data.Frame );
            }

            for ( var hand of data.Hands )
            {
				if ( hand.type == "left")
				{
					if (!leftHandVisual.isInitialized)
					{
						leftHandVisual.initializeHand(hand);
						createMeshes(leftHandVisual.handMeshArray);
						console.log("Created mesh for " + hand.type + " hand");
					}
					else
					{
						leftHandVisual.updateHand(hand);
					}
				}
				
				if ( hand.type == "right")
				{
					if (!rightHandVisual.isInitialized)
					{
						rightHandVisual.initializeHand(hand);
						createMeshes(rightHandVisual.handMeshArray);
						console.log("Created mesh for " + hand.type + " hand");
					}
					else
					{
						rightHandVisual.updateHand(hand);
					}
				}				
				//console.log("Created mesh for " + hand.type + " hand");
            }
        }
    },
        {
            Topic: "RightHandAirplane",
            Source: "Input.Processed.Efficio",
            Action: function ( data )
            {
                console.log( "AIRPLANE MODE DETECTED!" )
				/* BEGIN AIRPLANE MODE CODE
				
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

                    if ( changeX > 0 )
                    {
                        CadHelper.Navigation.Panning.PanRight( panAmount * ( changeX / 50 ) );
                    }
                    else
                    {
                        CadHelper.Navigation.Panning.PanLeft( panAmount * ( ( -1 * changeX ) / 50 ) );
                    }
                }
				END AIRPLANE MODE CODE */
            }
        },
    {
        Topic: "RightHandThumbIndexPinch",
        Source: "Input.Processed.Efficio",
        ExecutionPrerequisite: function ()
        {
            return selectedAsset == null && !isOrbiting;
        },
        Action: function ( data )
        {
			
			/* BEGIN PINCH 1 CODE
            var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();
            var appAdjustedPinchLocation = leapHelper.MapPointToAppCoordinates( data.Input.Frame, data.GestureInformation.PinchMidpoint, minsAndMaxes.Minimums, minsAndMaxes.Maximums );

            CorrectCoordinates( appAdjustedPinchLocation );

            var testFragment = CadHelper.AssetManagement.GetClosestFragmentToPoint( appAdjustedPinchLocation );

            //selectedAsset = testFragment.Fragment;
            selectedAsset = CadHelper.AssetManagement.GetFragmentById( 10 );
			
			END PINCH 1 CODE */
        }
    },
    {
        Topic: "RightHandThumbIndexPinch",
        Source: "Input.Processed.Efficio",
        ExecutionPrerequisite: function ()
        {
            return selectedAsset != null;
        },
        Action: function ( data )
        {
            isPinching = true;
			/* BEGIN PINCH 2 CODE
            var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();
            var appAdjustedPinchLocation = leapHelper.MapPointToAppCoordinates( data.Input.Frame, data.GestureInformation.PinchMidpoint, minsAndMaxes.Minimums, minsAndMaxes.Maximums );

            CorrectCoordinates( appAdjustedPinchLocation );

            CadHelper.AssetManagement.Transformer.Translate( selectedAsset, appAdjustedPinchLocation );
            setTimeout( function () { isPinching = false }, 200 );
			END PINCH 2 CODE */
        }
    },
    {
        Topic: "LeftHandThumbIndexPinch",
        Source: "Input.Processed.Efficio",
        ExecutionPrerequisite: function ()
        {
            return selectedAsset != null;
        },
        Action: function ( data )
        {
            selectedAsset = null;
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
        Action: function ( data )
        {
            alert( JSON.stringify( data ) );
        }
     },
	 {
	    Topic: "LeftHandZeroFingersExtended",
	    Source: "Input.Processed.Efficio",
	    Action: function ( data )
	    {
			 /* BEGIN LEFT FIST CODE
	         if ( data.GestureInformation.EndPosition )
	         {
	             var panAmount = 2;

	             var changeX = data.GestureInformation.StartPosition[0] - data.GestureInformation.EndPosition[0];

	             changeX = changeX > 50 ? 50 : changeX;
	             changeX = changeX < -50 ? -50 : changeX;


	             if ( changeX > 0 )
	             {
	                 CadHelper.Navigation.Panning.PanRight( panAmount * ( changeX / 50 ) );
	             }
	             else
	             {
	                 CadHelper.Navigation.Panning.PanLeft( panAmount * ( ( -1 * changeX ) / 50 ) );
	             }
	         }
			 END LEFT FIST CODE */
	     }
	 },
	{
		Topic: "RightHandZeroFingersExtended",
		Source: "Input.Processed.Efficio",
		ExecutionPrerequisite: function ()
		{
			return !isPinching;
		},
		Action: function ( data )
		{
			/* BEGIN RIGHT FIST CODE
			if ( data.GestureInformation.EndPosition )
			{
				isOrbiting = true;
				var rotateAmount = .1;

				var changeX = data.GestureInformation.StartPosition[0] - data.GestureInformation.EndPosition[0];

				changeX = changeX > 50 ? 50 : changeX;
				changeX = changeX < -50 ? -50 : changeX;

				if ( changeX > 0 )
				{
					CadHelper.Navigation.Rotation.RotateClockwise( rotateAmount * ( changeX / 50 ) );
				}
				else
				{
					CadHelper.Navigation.Rotation.RotateCounterClockwise( rotateAmount * ( ( -1 * changeX ) / 50 ) );
				}
				setTimeout( function () { isOrbiting = false }, 200 )
			}
			END RIGHT FIST CODE */
		}
	},
    ],
    AudioCommands: {
        'Create Sphere': function () { 
		//CreateSpheres();
		},
        'Navigation :tool': function ( tool ) { 
		//CadHelper.Tools.Navigation.SetActiveNavigationTool( tool ); 
		},
        'Select *part': function ( part ) { 
		//CadHelper.Tools.Model.SelectObject( part ) 
		},
        'Isolate *part': function ( part ) { 
		//CadHelper.Tools.Model.IsolateObject( part ) 
		},
        'Clear Selection': function () { 
		//CadHelper.Tools.Model.ClearSelection(); 
		}
    }
}

function CorrectCoordinates( position )
{
    position[0] = position[0] + 15;
    position[1] = position[1] - 30;
    position[2] = position[2] - 10;
}


/*
function CreateSpheres()
{
    //create material red
    var material_red =
        new THREE.MeshPhongMaterial(
                  { color: 0xff0000 } );

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
               Math.pow(( xdiff * xdiff +
                         ydiff * ydiff +
                         zdiff * zdiff ), 0.5 ) / 10;

    //createsphere1 and place it at max point of boundingBox
    var sphere_maxpt =
         new THREE.Mesh(
                new THREE.SphereGeometry(
                          niceRadius, 20 ),
                material_red );
    sphere_maxpt.position.set( maxpt.x,
                              maxpt.y,
                              maxpt.z );

    myMesh = sphere_maxpt;

    CadHelper.AssetManagement.CreateAsset( sphere_maxpt );
}
*/

function createMeshes( parentObject )
{
    for ( var mesh of parentObject )
		scene.add(mesh);
		//CadHelper.AssetManagement.CreateAsset( mesh );
}

function removeMeshes( parentObject )
{
    while ( mesh = parentObject.pop() )
    {
        //console.log( "Removing mesh with ID " + mesh.id )
        //CadHelper.AssetManagement.RemoveAsset( mesh );
		scene.remove(mesh);
    }

}

function createLineMeshFromHand( theHand, vectorAdjuster, knuckleGeometry, knuckleMaterial, lineMaterial, fullHandMesh )
{
    var minsAndMaxes = CadHelper.Tools.Model.GetMinAndMaxCoordinates();

    for ( var j = 0; j < theHand.fingers.length; j++ )
    {
        var finger = theHand.fingers[j];
        var positions = finger.positions;

        var geometryLine = new THREE.Geometry();
        var vertices = geometryLine.vertices;

        for ( var k = 0; k < positions.length; k++ )
        {
            var vertex = vectorAdjuster( positions[k] );
            vertices.push( vertex );

            var mesh = new THREE.Mesh( knuckleGeometry, knuckleMaterial );
            mesh.position.copy( vertex );
            fullHandMesh.push( mesh );
        }

        fullHandMesh.push( new THREE.Line( geometryLine, lineMaterial ) );
    }
}

function createBoneMeshFromHand( theHand, vectorAdjuster, knuckleGeometry, knuckleMaterial, boneGeometry, boneMaterial, fullHandMesh )
{
    for ( var j = 0; j < theHand.fingers.length; j++ )
    {
        var finger = theHand.fingers[j];
        var positions = finger.positions;

        var geometryLine = new THREE.Geometry();
        var vertices = geometryLine.vertices;

        for ( var k = 0; k < 5; k++ )
        {
            var vertex = vectorAdjuster( positions[k] );

            var mesh = new Physijs.SphereMesh( knuckleGeometry, knuckleMaterial );
            mesh.position.copy( vertex );
            fullHandMesh.push( mesh );
			/*
            if ( k < 4 )
            {
                var next = vectorAdjuster( positions[k + 1] );
                var d = vertex.distanceTo( next );

                mesh = new THREE.Mesh( boneGeometry, boneMaterial );
                mesh.scale.set( 1, 1, d || 1 );
                mesh.position.lerpVectors( vertex, next, 0.5 );
                mesh.lookAt( vertex );

                fullHandMesh.push( mesh );

            }
			*/
        }
    }
}

var skinMat = new THREE.MeshPhongMaterial( { color: 0xA28857 } );
var lineMat = new THREE.LineBasicMaterial({color: 0xffffff});

var knuckleGeo = new THREE.SphereGeometry( 2, 16, 24 );
var boneGeo = new THREE.CylinderGeometry( 3.7, 3.7, 1, 24 );


var createCylinderBoneBetweenJoints = function(boneGeometry, boneMaterial, prevJoint, nextJoint)
{
	var d = prevJoint.distanceTo( nextJoint );
	var boneMesh = new THREE.Mesh( boneGeometry, boneMaterial );
	boneMesh.scale.set( 1, 1, d || 1 );
	boneMesh.position.lerpVectors( prevJoint, nextJoint, 0.5 );
	boneMesh.lookAt( prevJoint );
	return boneMesh;
}
	
var createLineBetweenJoints = function(prevJoint, nextJoint)
{
	var lineGeo = new THREE.Geometry();
	lineGeo.vertices.push(prevJoint, nextJoint);
	var boneLine = new THREE.Line( lineGeo, lineMat);
	return boneLine;
}

function HandVisualizer(useCylinderBones)
{
	this.skinMaterial = new THREE.MeshPhongMaterial( { color: 0xA28857 } );
	this.lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff});

	this.knuckleGeometry = new THREE.SphereGeometry( 4.5, 16, 24 );
	this.boneGeometry = new THREE.CylinderGeometry( 3.7, 3.7, 1, 24 );
	this.vectorAdjuster = function(positionArray) { return new THREE.Vector3().fromArray(positionArray);}

	this.boneCreationFunction = function(prevJoint, nextJoint)
	{
		if (this.useCylinderBones)
		{
			var d = prevJoint.distanceTo( nextJoint );
			var boneMesh = new THREE.Mesh(this.boneGeometry, this.skinMaterial);
			boneMesh.scale.set( 1, 1, d || 1 );
			boneMesh.position.lerpVectors( prevJoint, nextJoint, 0.5 );
			boneMesh.lookAt( prevJoint );
			return boneMesh;
		}
		else
		{
			var lineGeo = new THREE.Geometry();
			lineGeo.vertices.push(prevJoint, nextJoint);
			var boneLine = new THREE.Line( lineGeo, this.lineMaterial);
			return boneLine;
		}
	}
	
	this.handMeshArray = [];
	
	this.isInitialized = false;
	this.hand = null;
	
	this.knuckles = [];
	this.bones = [];
	
	this.initializeHand = function(hand)
	{
		this.knuckles = [];
		this.bones = [];
		//this.handMeshArray = createHandMesh(hand, this.vectorAdjuster, this.knuckleGeometry, this.skinMaterial, this.boneCreationFunction, this.handMeshArray);
		for ( var j = 0; j < hand.fingers.length; j++ )
		{
			//var lastbone = null;
			var finger = hand.fingers[j];
			var positions = finger.positions;

			for ( var k = 0; k < 5; k++ )
			{
				var vertex = this.vectorAdjuster( positions[k] );

				var knuckle = new Physijs.SphereMesh( this.knuckleGeometry, this.skinMaterial );
				knuckle.position.copy( vertex );
				this.knuckles.push(knuckle);
				this.handMeshArray.push( knuckle );
				
				/*
				if ( k < 4 )
				{	
					var next = this.vectorAdjuster( positions[k + 1] );
					var bone = this.boneCreationFunction(vertex, next);
					bone.prevKunckle = knuckle;
					bone.nextKnuckleIndex = this.knuckles.length;
					this.bones.push(bone);
					this.handMeshArray.push(bone);
				}
				*/
			}
		}
		
		this.hand = hand;
		this.isInitialized = true;
	}
	
	this.updateHand = function(hand)
	{
		for ( var j = 0; j < hand.fingers.length; j++ )
		{
			var finger = hand.fingers[j];
			var positions = finger.positions;
			
			for ( var k = 0; k < 5; k++ )
			{
				var vertex = this.vectorAdjuster( positions[k] );
				this.knuckles[(j*4)+k].position.copy(vertex);
				
				this.knuckles[(j*4)+k].position.set( vertex.x, vertex.y, vertex.z );
				this.knuckles[(j*4)+k].__dirtyPosition = true;

				// You may also want to cancel the object's velocity
				this.knuckles[(j*4)+k].setLinearVelocity(new THREE.Vector3(0, 0, 0));
				this.knuckles[(j*4)+k].setAngularVelocity(new THREE.Vector3(0, 0, 0));
	
				//var mesh = new THREE.Mesh( knuckleGeometry, knuckleMaterial );
				//mesh.position.copy( vertex );
				//fullHandMesh.push( mesh );
			}
		}
		
		/*
		if (!this.useCylinderBones)
		{
			for (var i = 0; i < this.bones.length; i++)
			{
				var currentBone = this.bones[i];
				var prevKunckle = this.bones[i].prevKunckle;
				
				this.bones[i].geometry.vertices[0].x = prevKunckle.position.x;
				this.bones[i].geometry.vertices[0].y = prevKunckle.position.y;
				this.bones[i].geometry.vertices[0].z = prevKunckle.position.z;
				
				
				if (!(typeof(this.knuckles[currentBone.nextKnuckleIndex]) === 'undefined'))
				{
					var nextKnuckle = this.knuckles[currentBone.nextKnuckleIndex];
					this.bones[i].geometry.vertices[1].x = nextKnuckle.position.x;
					this.bones[i].geometry.vertices[1].y = nextKnuckle.position.y;
					this.bones[i].geometry.vertices[1].z = nextKnuckle.position.z;
				}
				else
				{
					console.log("ERROR - No next knuckle for a certain bone");
				}
				
				this.bones[i].geometry.verticesNeedUpdate = true;
			}
		}
		*/
	}
	
	this.clearAll = function()
	{
		this.handMeshArray = [];
	
		this.isInitialized = false;
		this.hand = null;
		
		this.knuckles = [];
		this.bones = [];
	}
}


function createHandMesh(theHand, vectorAdjuster, knuckleGeometry, knuckleMaterial, boneCreationFunction, fullHandMesh )
{
	for ( var j = 0; j < theHand.fingers.length; j++ )
	{
		var finger = theHand.fingers[j];
		var positions = finger.positions;


		for ( var k = 0; k < 5; k++ )
		{
			var vertex = vectorAdjuster( positions[k] );

			var mesh = new THREE.Mesh( knuckleGeometry, knuckleMaterial );
			mesh.position.copy( vertex );
			fullHandMesh.push( mesh );
			
			if ( k < 4 )
			{	
				var next = vectorAdjuster( positions[k + 1] );
				var bone = boneCreationFunction(vertex, next);
				fullHandMesh.push(bone);
			}
		}
	}
}
