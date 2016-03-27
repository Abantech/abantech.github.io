var now;
var fps = 0;
var rayCenter = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var counter = 0;
var targetBall;
var targetBallDistance = 10;
var selectedCube;

ThreeDRoomPlugin = {
    Ready: function (data) {
        CreateScene();
        //document.getElementById( "info" ).innerHTML = "You have seen me " + counter++ + " times"
    },

    DrawHands: function (data) {
        
    },

    CameraUpdate: function ( data )
    {
        if ( controls )
        {
            controls.onDeviceOrientationChangeEvent( data.Input.DeviceOrientation );

            var message = "DEFINED";
            if ( typeof ( targetBall ) === "undefined" )
            {
                var geo = new THREE.SphereGeometry( 5, 32, 32 );
                var mat = new THREE.MeshNormalMaterial();
                targetBall = new THREE.Mesh( geo, mat );
                camera.add( targetBall );
                targetBall.position = new THREE.Vector3( 0, 0, targetBallDistance );
            }

            if ( typeof ( selectedCube ) === "undefined" )
            {
                rayCenter.x = 0;
                rayCenter.y = 0;
                raycaster.setFromCamera( rayCenter, camera );
                raycaster.far = 5000;
                var intersects = raycaster.intersectObjects( scene.children );
                var intersectedObjectsCount = intersects.length;
                for ( var i = 0; i < intersectedObjectsCount; i++ )
                {
                    document.getElementById( "info" ).innerHTML = "Intersected object with ID " + intersects[i].object.id;
                    if ( intersects[i].object.isAsset )
                    {
                        intersects[i].object.material.color.set( 0xff0000 );
                        selectedCube = intersects[i].object;
                    }
                    //document.getElementById( "info" ).innerHTML = intersectedObjectsCount > 0 ? "Nothing intersected" : "INTERSECTED " + intersectedObjectsCount + " OBJECTS"
                }
            }
            else
            {
                selectedCube.position.copy( targetBall.position );
            }
            //var message = typeof(camera) === "undefined" ? "NOT defined" : "DEFINED";
            document.getElementById( "info" ).innerHTML = "You have VALIDATED camera " + message + " " + counter++ + " times"
        }
        //document.getElementById( "info" ).innerHTML = "You have seen me " + counter++ + " times"
    },

    SceneRotate: function (data) {
        controls.onScreenOrientationChangeEvent();
    }
}