var readyFunc = EfficioConfiguration.ActionToFunctionMapping.ActionMappings.filter(function (mapping) {
    return mapping.Topic === 'Ready' && mapping.Source === 'Efficio'
});

if (readyFunc.length === 1) {
    var index = EfficioConfiguration.ActionToFunctionMapping.ActionMappings.indexOf(readyFunc[0]);
    var original = EfficioConfiguration.ActionToFunctionMapping.ActionMappings[index].Action;

    EfficioConfiguration.ActionToFunctionMapping.ActionMappings[index].Action = function () {
        original();
        CadHelper.viewer.loadExtension('Autodesk.ADN.Viewing.Extension.InstructionsPanel');
        //CadHelper.viewer.getExtension('Autodesk.ADN.Viewing.Extension.InstructionsPanel').load();
    };
}