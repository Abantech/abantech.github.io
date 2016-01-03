Test = {

}

ActionToFunctionMapping = {
    "Bridge": Test,
    "ActionMappings": [{
        Topic: "RawOrientationData",
        Source: "Input.Processed.Efficio.Device",
        Action: function (data) {
        }
    }, {
        Topic: "Location",
        Source: "Input.Raw.Device",
        Action: function (data) {
        }
    },
    {
        Topic: "Orientation Change",
        Source: "Input.Raw",
        Action: function () {
           
        }
    }]
}