Test = {

}

ActionToFunctionMapping = {
    "Bridge": Test,
    "ActionMappings": [{
        "Topic": "RightHandDetected",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            if (_viewer && _viewer.navigation) {
                var camera = _viewer.navigation.getCamera();
                camera.position.set(camera.position.x - 1, camera.position.y, camera.position.z)
            }
        }
    }, {
        "Topic": "LeftHandDetected",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            if (_viewer && _viewer.navigation) {
                var camera = _viewer.navigation.getCamera();
                camera.position.set(camera.position.x + 1, camera.position.y, camera.position.z)
            }
        }
    }]
}