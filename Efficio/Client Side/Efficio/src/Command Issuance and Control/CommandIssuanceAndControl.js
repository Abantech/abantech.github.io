define(['postal', 'Asset Management and Inventory/AssetManager'], function (bus, ami) {
    function Invoke(source, topic, data, reason) {
        bus.publish({
            channel: source,
            topic: topic,
            source: reason,
            data: data
        });
    }

    return {
        Initialize: function () {
            var caic = { Invoke: Invoke };

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

            function getBridge(bridge) {
                if (typeof bridge === 'object') {
                    return bridge;
                }

                if (typeof bridge === 'string') {
                    if (window[bridge] && typeof window[bridge] === 'object') {
                        return window[bridge]
                    }
                }

                throw new Exception('No bridging class is provided');
            }

            a2fm.ActionMappings.forEach(function (mapping) {
                bus.subscribe({
                    channel: mapping.Source,
                    topic: mapping.Topic,
                    callback: function (data, envelope) {
                        data.Message = {
                            Channel: envelope.channel,
                            Topic: envelope.topic,
                            Source: envelope.source
                        }

                        var func = mapping.Action;

                        if (typeof func != 'function') {
                            func = getBridge(a2fm.Bridge)[mapping.Action];
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
                                if (data.GestureInformation.Fired) {
                                    return;
                                }
                            }

                            if (restrictions.FireAfterXFrames) {
                                if (data.GestureInformation.FireCount < restrictions.FireAfterXFrames) {
                                    return;
                                }
                            }
                        }

                        if (mapping.ExecutionPrerequisite) {
                            var prereq = mapping.ExecutionPrerequisite;

                            if (typeof mapping.ExecutionPrerequisite != 'function') {
                                prereq = getBridge(a2fm.Bridge)[mapping.ExecutionPrerequisite];
                            }

                            if (!prereq()) {
                                return;
                            }
                        }

                        func.apply(null, args);

                        if (data.GestureInformation) {
                            data.GestureInformation.Fired = true;
                        }
                    }
                })
            });

            return caic;
        }
    };
});