var now;
var fps = 0;
var rayCenter = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var counter = 0;
var targetBall;
var targetBallDistance = 10;

ThreeDRoomPlugin = {
    Ready: function (data) {
        CreateScene();
        //document.getElementById( "info" ).innerHTML = "You have seen me " + counter++ + " times"
    },

    DrawHands: function (data) {
        
    },

    CameraUpdate: function (data) {
        if (controls) {
            controls.onDeviceOrientationChangeEvent( data.Input.DeviceOrientation );
            if ( typeof ( targetBall ) === "undefinded" )
            {
                document.getElementById( "info" ).innerHTML = "Camera is " + typeof ( camera ) === "undefined" ? "NOT defined" : "DEFINED")
/*
                //document.getElementById( "info" ).innerHTML = "You have seen me " + counter++ + " times"
                rayCenter.x = 0;
                rayCenter.y = 0;
                raycaster.setFromCamera( rayCenter, camera );
                raycaster.far = 5000;
                var intersects = raycaster.intersectObjects( scene.children );
                var intersectedObjectsCount = intersects.length;
                //document.getElementById( "info" ).innerHTML = intersectedObjectsCount > 0 ? "Nothing intersected" : "INTERSECTED " + intersectedObjectsCount + " OBJECTS"
                for ( var i = 0; i < intersectedObjectsCount; i++ )
                {
                    document.getElementById( "info" ).innerHTML = "Intersected object with ID " + intersects[i].object.id;
                    if ( intersects[i].object.isAsset )
                    {
                        targetBallDistance = intersects[i].distance;
                        intersects[i].object.material.color.set( 0xff0000 );
*/
                        var geometry = new THREE.SphereGeometry(5, 32, 32);
                        var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
                        targetBall = new THREE.Mesh( geometry, material );
                        camera.add( targetBall );
/*
                    }
                }
*/
            }

            targetBall.position = new THREE.Vector3( 0, 0, targetBallDistance );
        }
        //document.getElementById( "info" ).innerHTML = "You have seen me " + counter++ + " times"
    },

    SceneRotate: function (data) {
        controls.onScreenOrientationChangeEvent();
    }
}