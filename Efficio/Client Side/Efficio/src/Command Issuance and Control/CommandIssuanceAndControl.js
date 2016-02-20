define(['postal', 'Asset Management and Inventory/AssetManager', 'Utils/GuidGenerator'], function (bus, ami, guidGenerator) {
    function AddMapping(channel, topic, action, executionPrerquisite, fireRestrictions) {
        AddActionMapping({
            Source: channel,
            Topic: topic,
            UUID: guidGenerator.NewGuid(),
            Action: action,
            ExecutionPrerequisite: executionPrerquisite,
            FireRestrictions: fireRestrictions
        });
    }

    function RemoveMapping(uuid) {
        bus.unsubscribeFor({ uuid: uuid });
    }

    function AddActionMapping(mapping) {
        if (!mapping.UUID) {
            mapping.UUID = guidGenerator.NewGuid();
        }

        var subscription =
            bus.subscribe({
                channel: mapping.Source,
                topic: mapping.Topic,
                callback: function (data, envelope) {
                    if (!data) {
                        data = {};
                    }

                    data.Message = {
                        Channel: envelope.channel,
                        Topic: envelope.topic,
                        Source: envelope.source,
                        SubscriptionUUID: mapping.UUID
                    }

                    var func = mapping.Action;

                    if (typeof func != 'function') {
                        func = getBridge(a2fm.Bridge)[mapping.Action];
                    }

                    // Get method parameters
                    var functionParameters = GetParamNames(func);

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

                    if (!data.GestureInformation) {
                        data.GestureInformation = {};
                    }

                    if (!data.GestureInformation[mapping.UUID]) {
                        data.GestureInformation[mapping.UUID] = {};
                    }

                    if (mapping.FireRestrictions) {
                        var execute = [];
                        var restrictions = mapping.FireRestrictions;
                        if (restrictions.FireOnce) {

                            if (data.GestureInformation[mapping.UUID].Fired) {
                                return;
                            }
                        }

                        if (restrictions.FireAfterXFrames) {
                            if (data.GestureInformation[mapping.UUID].FireCount < restrictions.FireAfterXFrames) {
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

                    if (data.GestureInformation[mapping.UUID]) {
                        data.GestureInformation[mapping.UUID].Fired = true;
                    }
                }
            })
    }

    function GetParamNames(func) {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var ARGUMENT_NAMES = /([^\s,]+)/g;

        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    }

    return {
        Initialize: function () {
            var caic = { AddMapping: AddMapping, RemoveMapping: RemoveMapping };
            var a2fm = Efficio.Configuration.ActionToFunctionMapping || {};


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

            a2fm.ActionMappings.forEach(AddActionMapping);

            return caic;
        }
    };
});