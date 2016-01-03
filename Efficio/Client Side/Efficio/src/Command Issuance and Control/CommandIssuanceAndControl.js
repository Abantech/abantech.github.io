define(['postal', 'Asset Management and Inventory/AssetManager'], function (bus, ami) {
    return {
        Initialize: function () {
            var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
            var ARGUMENT_NAMES = /([^\s,]+)/g;
            var a2fm = Efficio.Configuration.ActionToFunctionMapping || {};

            function getParamNames(func) {
                var fnStr = func.toString().replace(STRIP_COMMENTS, '');
                var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
                if (result === null)
                    result = [];
                return result;
            }

            a2fm.ActionMappings.forEach(function (mapping) {
                bus.subscribe({
                    channel: mapping.Source,
                    topic: mapping.Topic,
                    callback: function (data, envelope) {
                        var func = mapping.Action;

                        if (typeof func != 'function') {
                            func = a2fm.Bridge[mapping.Action];
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

                            args[args.length] = data;
                        }
                        else {
                            args = [data];
                        }

                        if (mapping.FireRestrictions) {
                            var execute = [];
                            var restrictions = mapping.FireRestrictions;
                            if (restrictions.FireOnce) {
                                if (data.gestureInformation.Fired) {
                                    return;
                                }
                            }

                            if (restrictions.FireAfterXFrames) {
                                if (data.gestureInformation.FireCount < restrictions.FireAfterXFrames) {
                                    return;
                                }
                            }
                        }

                        func.apply(null, args);

                        if (data.gestureInformation) {
                            data.gestureInformation.Fired = true;
                        }
                    }
                })
            });
        }
    };
});