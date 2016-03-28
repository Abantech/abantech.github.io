var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );

var armMeshes = [];
var boneMeshes = [];

var handHolder = new THREE.Object3D();
var leftHand;// = new THREE.Object3D();
var rightHand;// = new THREE.Object3D();

var LeapToSceneCoordinates = function ( v )
{
    var xCoordinate = v.x;
    var yCoordinate = v.y + camera.position.y - 150;
    var zCoordinate = v.z - 200;

    var returnVector = new THREE.Vector3( xCoordinate, yCoordinate, zCoordinate );
    returnVector.applyQuaternion( camera.quaternion );

    return returnVector;
}

function DrawHands( hands )
{
    if ( typeof renderer !== 'undefined' )
    {
        var countBones = 0;
        var countArms = 0;

        camera.rotateY( .02 );

        scene.remove( handHolder );
        handHolder = new THREE.Object3D();

        //var lineMat = new THREE.LineBasicMaterial( { color: 0x000000 } );
        var knuckleMat;// = new THREE.MeshPhongMaterial( { color: 0xA28857 } );
        var boneMat = new THREE.MeshNormalMaterial();//new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

        var knuckleGeo = new THREE.SphereGeometry( 4.5, 16, 24 );
        var boneGeo = new THREE.CylinderGeometry( 3.7, 3.7, 1, 24 );
        boneGeo.applyMatrix( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );



        for ( var hand of hands )
        {
            if ( hand.type == "left" )
            {
                leftHand = new THREE.Object3D();
                knuckleMat = new THREE.MeshNormalMaterial();//.MeshPhongMaterial( { color: 0x00FF00 } );
            }
            else
            {
                rightHand = new THREE.Object3D();
                knuckleMat = new THREE.MeshNormalMaterial(); //new THREE.MeshPhongMaterial( { color: 0xFF0000 } );
            }

            var newHandMesh = createBoneMeshFromHand( hand, LeapToSceneCoordinates, knuckleGeo, knuckleMat, boneGeo, boneMat, hand.type == "left" ? leftHand : rightHand );

            handHolder.add( newHandMesh);
        }

        scene.add( handHolder );
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
            var vertex = vectorAdjuster( new THREE.Vector3(positions[k][0], positions[k][1], positions[k][2]));
            //var vertex = new THREE.Vector3( positions[k].x, positions[k].y, positions[k].z )//.fromArray( positions[k] );
            var mesh = new THREE.Mesh( knuckleGeometry, knuckleMaterial );
            mesh.position.copy( vertex );
            fullHandMesh.add( mesh );

            if ( k < 4 )
            {
                var next = vectorAdjuster( new THREE.Vector3( positions[k + 1][0], positions[k + 1][1], positions[k + 1][2]));
                //var next = new THREE.Vector3().fromArray( positions[k + 1] );
                var d = vertex.distanceTo( next );

                mesh = new THREE.Mesh( boneGeometry, boneMaterial );
                mesh.scale.set( 1, 1, d || 1 );
                mesh.position.lerpVectors( vertex, next, 0.5 );
                mesh.lookAt( vertex );

                fullHandMesh.add( mesh );

            }
        }
    }

    return fullHandMesh;
}


function addMesh( meshes )
{

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh( geometry, material );
    meshes.push( mesh );

    return mesh;

}

function updateMesh( bone, mesh )
{
    var position = new THREE.Vector3();
    position.fromArray( bone.center() );

    var scenePosition = LeapToSceneCoordinates( position.clone() );

    mesh.position.copy( scenePosition );
    mesh.setRotationFromMatrix(( new THREE.Matrix4 ).fromArray( bone.matrix() ) );

    mesh.quaternion.copy( camera.quaternion );
    mesh.quaternion.multiply( baseBoneRotation );
    mesh.scale.set( bone.width / 2, bone.width / 2, bone.length );

    handHolder.add( mesh );
}

