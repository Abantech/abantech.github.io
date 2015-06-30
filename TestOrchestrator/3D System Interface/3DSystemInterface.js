var bus = require('postal');
var fs = require('fs');

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
        var config = JSON.parse(fs.readFileSync('./3D System Interface/ActionToFunctionMapping.json', 'utf8'));
        
        ThreeDSystem = require('./' + config.PluginName);
        
        config.ActionMappings.forEach(function (mapping) {
            RegisterSubscriber(
                bus.subscribe({

                    channel: mapping.Source,
                    topic: mapping.Topic,
                    callback: function (data, envelope) {

                        console.log('\n' + envelope.topic + ' Received in Plugin');
                        
                        var returnedFromFunction = new Object();
                        returnedFromFunction.publishResults = true;
                        
                        //This is the actual call to the external tool's plugin (i.e. SketchUp.js)
                        CallDynamicFunction(mapping.Action, data, returnedFromFunction);
                        
                        if (mapping.Result) {
                            mapping.Result.forEach(function (result) {
                                var data = new Object();
                                
                                if (result.Data) {
                                    for (key in result.Data) {
                                        data[key] = returnedFromFunction[result.Data[key]];
                                    }
                                }
                                
                                if (returnedFromFunction.publishResults) {
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