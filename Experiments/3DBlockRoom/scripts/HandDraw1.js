var baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );

var armMeshes = [];
var boneMeshes = [];

var handHolder = new THREE.Object3D();

function DrawHands( hands )
{
    if ( typeof renderer !== 'undefined' )
    {
        var countBones = 0;
        var countArms = 0;

        camera.rotateY( .025 );

        scene.remove( handHolder );
        handHolder = new THREE.Object3D();

        for ( var hand of hands ) {

            for ( var finger of hand.fingers ) {

                for ( var bone of finger.bones ) {

                    if ( countBones++ === 0 ) { continue; }

                    var boneMesh = boneMeshes[countBones] || addMesh( boneMeshes );
                    updateMesh( bone, boneMesh );
                }
            }
        }

        scene.add( handHolder );
    }
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

function LeapToSceneCoordinates( v )
{
    var xCoordinate = v.x;
    var yCoordinate = v.y + camera.position.y - 150;
    var zCoordinate = v.z - 200;

    var returnVector = new THREE.Vector3( xCoordinate, yCoordinate, zCoordinate );
    returnVector.applyQuaternion( camera.quaternion );

    return returnVector;
}