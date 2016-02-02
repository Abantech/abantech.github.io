EfficioConfiguration.ActionToFunctionMapping.AudioCommands[':command Instructions'] = function (command) {
    var instructionBox = CadHelper.viewer.getExtension('Autodesk.ADN.Viewing.Extension.InstructionsPanel');
    var verbalInstructions = CadHelper.viewer.getExtension('Autodesk.ADN.Viewing.Extension.VerbalInstructionsPanel');

    switch (command) {
        case 'open': {
            instructionBox.load();
            break;
        }
        case 'close': {
            var box = null;

            if (instructionBox.isLoaded()) {
                box = instructionBox;
            }

            if (verbalInstructions && verbalInstructions.isLoaded()) {
                box = verbalInstructions;
            }

            if (box) {
                box.unload();
            }

            break;
        }
        case 'minimize': {
            var box = null;

            if (instructionBox.isLoaded()) {
                box = instructionBox;
            }

            if (verbalInstructions && verbalInstructions.isLoaded()) {
                box = verbalInstructions;
            }

            if (box) {
                box.minimize();
            }

            break;
        }
        case 'maximize': {
            var box = null;

            if (verbalInstructions && instructionBox.isLoaded()) {
                box = instructionBox;
            }

            if (verbalInstructions && verbalInstructions.isLoaded()) {
                box = verbalInstructions;
            }

            if (box) {
                box.maximize();
            }

            break;
        }
        case 'verbal': {
            instructionBox.unload();
            CadHelper.viewer.loadExtension('Autodesk.ADN.Viewing.Extension.VerbalInstructionsPanel');
            break;
        }
        default:

    }
}

EfficioConfiguration.ActionToFunctionMapping.AudioCommands["Try Navigation"] = function () {
    var navBox = CadHelper.viewer.getExtension('Autodesk.ADN.Viewing.Extension.NavigationInstructionsPanel');
    var verbalInstructions = CadHelper.viewer.getExtension('Autodesk.ADN.Viewing.Extension.VerbalInstructionsPanel');

    verbalInstructions.unload();
    CadHelper.viewer.loadExtension('Autodesk.ADN.Viewing.Extension.NavigationInstructionsPanel');
}

EfficioConfiguration.ActionToFunctionMapping.AudioCommands["Rotate :degrees degrees :direction"] = function (degrees, direction) {
    switch (direction) {
        case 'clockwise':
            {
                CadHelper.Navigation.Rotation.RotateClockwise(degrees);
                break;
            }
        case 'counterclockwise':
            {
                CadHelper.Navigation.Rotation.RotateCounterClockwise(degrees);
                break;
            }
        default:

    }
}