Test = {

}

ActionToFunctionMapping = {
    "Bridge": Test,
    "ActionMappings": [{
        Topic: "RawOrientationData",
        Source: "Input.Processed.Efficio.Device",
        Action: function (data) {
            if (controls) {
                controls.onDeviceOrientationChangeEvent(data.Input.DeviceOrientation);

                if (data.GestureInformation.FireCount % 5 === 0) {
                    websocket.send(JSON.stringify({
                        Topic: 'Partner Updated',
                        Quarternion: camera.quaternion,
                        Position: camera.position
                    }));
                }                
            }
        }
    }, {
        Topic: "Location",
        Source: "Input.Raw.Device",
        Action: function (data) {
            var string = JSON.stringify({
                Topic: 'Location',
                Location: {
                    Latitude: data.Location.coords.latitude,
                    Longitude: data.Location.coords.longitude,
                }
            })

            //var oldLat = camera.userData.Latitude || data.Location.coords.latitude;
            //var oldLong = camera.userData.Longitude || data.Location.coords.longitude;

            //camera.userData.Latitude = data.Location.coords.latitude;
            //camera.userData.Longitude = data.Location.coords.longitude;

            //var latDif = (oldLat - data.Location.coords.latitude) * 10 * 10 * 10 * 10 * 10 * 10 * 10;
            //var longDif = (oldLong - data.Location.coords.longitude) * 10 * 10 * 10 * 10 * 10 * 10 * 10;

            //if (Math.abs(latDif) + Math.abs(longDif) > 1) {
            //    camera.position.setX(partnerMesh.position.x - latDif * 2);
            //    camera.position.setZ(partnerMesh.position.z - longDif * 2);
            //    console.log("Moving Camera:\nLat: " + partnerMesh.position.x - latDif * 2 + "\nLon: " + partnerMesh.position.z - longDif * 2)
            //}

            websocket.send(string);
        }
    },
    {
        Topic: "Orientation Change",
        Source: "Input.Raw",
        Action: function () {
            controls.onScreenOrientationChangeEvent(data.DeviceOrientation);
        }
    }]
}