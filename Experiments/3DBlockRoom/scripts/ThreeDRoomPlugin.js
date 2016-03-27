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

            //var message = typeof(camera) === "undefined" ? "NOT defined" : "DEFINED";
            document.getElementById( "info" ).innerHTML = "You have VALIDATED camera " + message + " " + counter++ + " times"
        }
        //document.getElementById( "info" ).innerHTML = "You have seen me " + counter++ + " times"
    },

    SceneRotate: function (data) {
        controls.onScreenOrientationChangeEvent();
    }
}