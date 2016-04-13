var now;
var fps = 0;
var pinchMeshes = [];
var pinchMesh;

ThreeDRoomPlugin = {
    Ready: function ( data )
    {
        CreateScene();
        //require(["scripts/lib/leap.transform"], function() {
        //    Efficio.DeviceManager.ConnectedDevices().LeapMotion.Device.use('transform', {

        //        // This matrix flips the x, y, and z axis, scales to meters, and offsets the hands by -8cm.
        //        vr: true,

        //        // This causes the camera's matrix transforms (position, rotation, scale) to be applied to the hands themselves
        //        // The parent of the bones remain the scene, allowing the data to remain in easy-to-work-with world space.
        //        // (As the hands will usually interact with multiple objects in the scene.)
        //        effectiveParent: camera,
        //    });
        //})

    },

    DrawHands: function ( data )
    {
        DrawHands( data.Hands );
    },

    CameraUpdate: function ( data )
    {
        if ( controls )
        {
            controls.onDeviceOrientationChangeEvent( data.Input.DeviceOrientation );
        }
    },

    SceneRotate: function ( data )
    {
        controls.onScreenOrientationChangeEvent();
    },

    CreateMovingBlock: function ( data )
    {
        var pinchLocation = new THREE.Vector3();
        pinchLocation.fromArray( data.GestureInformation.PinchMidpoint );

        var correctedPinchLocation = LeapToSceneCoordinates( pinchLocation );

        //var closeEnoughMeshes = [];
        //var closestMesh;

        //pinchMeshes.forEach(function (mesh) {
        //    if (correctedPinchLocation.distanceTo(mesh.position) < 100) {
        //        closeEnoughMeshes.push(mesh);
        //    }
        //});

        //closeEnoughMeshes.forEach(function (mesh) {
        //    if (!closestMesh || correctedPinchLocation.distanceTo(mesh) < correctedPinchLocation.distanceTo(closestMesh)) {
        //        closestMesh = mesh;
        //    }
        //});

        //if (!closestMesh) {
        //    var geometry = new THREE.BoxGeometry(50, 50, 50);
        //    var material = new THREE.MeshNormalMaterial();
        //    closestMesh = new THREE.Mesh(geometry, material);
        //    closestMesh.position.copy(correctedPinchLocation);
        //    closestMesh.quaternion.copy(camera.quaternion);
        //    pinchMesh.push(closestMesh);

        //    scene.add(closestMesh);
        //}

        //closestMesh.position.copy(correctedPinchLocation);
        //closestMesh.quaternion.copy(camera.quaternion);

        if ( !pinchMesh )
        {
            var geometry = new THREE.BoxGeometry( 50, 50, 50 );
            var material = new THREE.MeshNormalMaterial();
            pinchMesh = new THREE.Mesh( geometry, material );
            pinchMesh.position.copy( correctedPinchLocation );
            pinchMesh.quaternion.copy( camera.quaternion );

            scene.add( pinchMesh );
        }

        if ( correctedPinchLocation.distanceTo( pinchMesh.position ) < 100 )
        {
            pinchMesh.position.copy( correctedPinchLocation );
            pinchMesh.quaternion.copy( camera.quaternion );
        }
    }
}