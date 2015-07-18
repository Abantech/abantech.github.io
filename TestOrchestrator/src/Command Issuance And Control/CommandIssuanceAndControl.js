var bus = require('postal');
var fs = require('fs');
var ami = require('../Asset Management And Inventory/AssetManager.js');

var ThreeDSystem;

var subscriptions = new Array();

function RegisterSubscriber(subscription) {
    subscriptions.push(subscription);
}

function CallDynamicFunction(func, data, returnedFromFunction) {
    return ThreeDSystem[func](data, returnedFromFunction);
}

module.exports = 
{
    Initialize: function () {
        
        if (typeof window === 'undefined') {
            var file = fs.readFileSync('./src/Command Issuance And Control/ActionToFunctionMapping.json', 'UTF-8');
            var config = JSON.parse(file);
            ThreeDSystem = require('../3D System Interface/' + config.PluginName);

        } else {
            var config = ActionToFunctionMapping;
            ThreeDSystem = window[config.PluginName.substring(0, config.PluginName.length - 3)];
        }
        
        config.ActionMappings.forEach(function (mapping) {
            RegisterSubscriber(
                bus.subscribe({
                    
                    channel: mapping.Source,
                    topic: mapping.Topic,
                    callback: function (data, envelope) {
                        
                        var returnValues = {};
                        returnValues.publishResults = true;
                        
                        if (mapping.Arguments) {
                            var variableDeclaration = '';
                            var dynamicJavascript = '';

                            mapping.Arguments.forEach(function (argMapping) {
                                variableDeclaration = variableDeclaration + 'var ' + argMapping.MapTo

                                if (argMapping.Source === 'Gesture') {
                                    variableDeclaration = variableDeclaration + ' = data["' + argMapping.Name + '"];\n';

                                }

                                if (argMapping.Source === 'AssetManager') {
                                    variableDeclaration = variableDeclaration + ' = ami.GetValueForProperty("' + argMapping.Name + '", data);\n';
                                }
                                
                                if (argMapping.Source === 'Device') {
                                    variableDeclaration = variableDeclaration + ' = data["' + argMapping.Name + '"];\n';
                                }

                                dynamicJavascript = dynamicJavascript + argMapping.MapTo + ', '
                            });
                            
                            dynamicJavascript = 'ThreeDSystem[mapping.Action](' + dynamicJavascript.substring(0, dynamicJavascript.length - 2) + ', returnValues)';

                            eval(variableDeclaration);
                            eval(dynamicJavascript);
                        }
                        else {
                            //This is the actual call to the external tool's plugin (i.e. SketchUp.js)
                            CallDynamicFunction(mapping.Action, data, returnValues);
                        }

                        if (mapping.Result) {
                            mapping.Result.forEach(function (result) {
                                var data = new Object();
                                
                                if (result.Data) {
                                    for (key in result.Data) {
                                        data[key] = returnValues[result.Data[key]];
                                    }
                                }
                                
                                if (returnValues.publishResults) {
                                    bus.publish({
                                        channel: result.Channel,
                                        topic: result.Topic,
                                        source: mapping.Source,
                                        data: data
                                    });
                                }
                            });
                        }
                    }
                }));
        });
    }
};