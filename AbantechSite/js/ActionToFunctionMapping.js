var devices = [];

EfficioSitePlugin = {
    DownDirectionDetected: function ()
    {
        window.scrollBy(0, 20);

        $('#LeapModal').modal('hide')
    },
    UpDirectionDetected: function ()
    {
        window.scrollBy(0, -20);

        $('#LeapModal').modal('hide')
    },
    DeviceRegistered: function (Device)
    {
        devices.push(Device);
    }
}

ActionToFunctionMapping = {
    PluginName: "EfficioSitePlugin",
    ActionMappings: [
               
    ],
}