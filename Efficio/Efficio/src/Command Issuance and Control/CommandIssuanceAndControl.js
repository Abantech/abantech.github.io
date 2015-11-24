define(['postal', 'Asset Management and Inventory/AssetManager'], function (bus, ami) {
    return {
        Initialize: function () {
            var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
            var ARGUMENT_NAMES = /([^\s,]+)/g;

            function getParamNames(func) {
                var fnStr = func.toString().replace(STRIP_COMMENTS, '');
                var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
                if (result === null)
                    result = [];
                return result;
            }

            ActionToFunctionMapping.ActionMappings.forEach(function (mapping) 
            {
                bus.subscribe({
                    channel: mapping.Source,
                    topic: mapping.Topic,
                    callback: function (data, envelope) {
                        var func = mapping.Action;

                        if (typeof func != 'function') {
                            func = ActionToFunctionMapping.Bridge[mapping.Action];
                        }

                        // Get method parameters
                        var functionParameters = getParamNames(func);

                        var argMapping = {};

                        // Create args for function call
                        var args = [];

                        if (mapping.Arguments) {
                            functionParameters.forEach(function (param) {
                                var params = mapping.Arguments.filter(function (argument) {
                                    return argument.MapTo === param;
                                });

                                if (params.length > 0) {
                                    var value;

                                    if (params[0].Source && params[0].Source === 'AssetManager') {
                                        value = ami.GetValueForProperty(params[0].Name, data);
                                    }
                                    else {
                                        value = data[params[0].Name];
                                    }

                                    args.push(value);
                                }
                                else {
                                    args.push(null);
                                }
                            });
                        }
                        else {
                            args = [data];
                        }
                       
                        func.apply(null, args);
                    }
                })
            });
        }
    };
});