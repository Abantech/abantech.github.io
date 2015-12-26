define(['realsense'], function (realsense) {
    var alertLabelDictionary = {};

    function CreateDictionary() {
        var alertType = intel.realsense.hand.AlertType;
        for(var prop in alertType)
        {
            alertLabelDictionary[alertType[prop]] = prop;
        }
    }

    function GetNameForLabel(id) {
        return alertLabelDictionary[id];
    }

    function ExtendClasses() {
        CreateDictionary();

        var extensions = {
            GetNameForLabel: GetNameForLabel
        }

        for (var property in extensions) {
            intel.realsense.hand.AlertType[property] = extensions[property];
        }

        return extensions;
    }

    return {
        ExtendClasses: ExtendClasses
    }
})