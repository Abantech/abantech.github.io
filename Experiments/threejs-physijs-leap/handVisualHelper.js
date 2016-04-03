var skinMat = new THREE.MeshPhongMaterial( { color: 0xA28857 } );
var lineMat = new THREE.LineBasicMaterial({color: 0xffffff});

var knuckleGeo = new THREE.SphereGeometry( 4.5, 16, 24 );
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

				var knuckle = new THREE.Mesh( this.knuckleGeometry, this.skinMaterial );
				knuckle.position.copy( vertex );
				this.knuckles.push(knuckle);
				this.handMeshArray.push( knuckle );
				
				if ( k < 4 )
				{	
					var next = this.vectorAdjuster( positions[k + 1] );
					var bone = this.boneCreationFunction(vertex, next);
					bone.prevKunckle = knuckle;
					bone.nextKnuckleIndex = this.knuckles.length;
					this.bones.push(bone);
					this.handMeshArray.push(bone);
				}
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
				//var mesh = new THREE.Mesh( knuckleGeometry, knuckleMaterial );
				//mesh.position.copy( vertex );
				//fullHandMesh.push( mesh );
			}
		}
		
		
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
