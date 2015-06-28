var bus = require('postal');
var fs = require('fs');

var ThreeDSystem;

var subscriptions = new Array();

function RegisterSubscriber(subscription) {
    subscriptions.push(subscription);
}

function CallDynamicFunction(func, data) {
    return ThreeDSystem[func](data);
}

module.exports = 
{
    Initialize: function () {
        var config = JSON.parse(fs.readFileSync('./3D System Interface/ActionToFunctionMapping.json', 'utf8'));
        
        ThreeDSystem = require('./' + config.PluginName);
        
        config.ActionMappings.forEach(function (mapping) {
            RegisterSubscriber(
                bus.subscribe({
                    channel: "Input.Processed." + mapping.Source,
                    topic: mapping.Gesture,
                    callback: function (data, envelope) {
                        console.log('\n' + mapping.Gesture + ' Received in Plugin');
                        var result = CallDynamicFunction(mapping.Action, data);
                        
                        bus.publish({
                            channel: "Asset",
                            topic: mapping.Result,
                            source: mapping.Source,
                            data: {
                                asset: result
                            }
                        });
                    }
                }));
        });
    }
};