define(['postal', 'Input/DeviceManager', 'Input/Intel/RealSense/Sense Type/Hands/HelperFunctions'], function (bus, deviceManager, helper) {
    var source = 'Intel RealSense';
    var trackingType = 'Hands';
    var useNativeGestures = false;
    var connected = false;

    // TODO build out handTracking object for Efficio global object
    var handTracking = {};

    // On connected to device info
    function onConnect(sender, deviceConnected) {
        connected = deviceConnected;
    }

    // Error status
    function onStatus(sender, sts) {
        if (sts < 0) {
            status('Module error with status code: ' + sts);
            clear();
        }
    }

    // Process hand data when ready
    function onHandData(sender, data) {
        // retrieve hand data 
        var handData = data.queryHandData(intel.realsense.hand.AccessOrderType.ACCESS_ORDER_NEAR_TO_FAR);

        if (!handData) {
            handData = [];
        }

        bus.publish({
            channel: 'Input.Raw.Human',
            topic: 'RealSense',
            source: source,
            data: {
                TrackingType: trackingType,
                Input: data,
                Hands: handData
            }
        });

        var gestures = data.firedGestureData;
        if (gestures && gestures.length > 0) {
            gestures.forEach(function (gesture) {
                OnFiredGesture(gesture);
            });
        }

        var alerts = data.firedAlertData;
        if (alerts && alerts.length > 0) {
            // TODO convert to 'let' once migrated to 'use strict'
            var getNameForLabel = intel.realsense.hand.AlertType.GetNameForLabel;

            alerts.forEach(function (alert) {
                alert.name = getNameForLabel(alert.label);
                OnFiredAlert(alert);
            });
        }
    }


    function OnFiredAlert(alert) {
        bus.publish({
            channel: 'Input.Raw.Alerts',
            topic: alert.name,
            source: source,
            data: {
                TrackingType: trackingType,
                Alert: alert
            }
        });
    }

    function OnFiredGesture(gesture) {
        bus.publish({
            channel: 'Input.Raw.Gestures',
            topic: gesture.name,
            source: source,
            data: {
                TrackingType: trackingType,
                Gesture: gesture
            }
        });
    }

    function Start(sense, useGestures) {
        useNativeGestures = useGestures || false;

        // Extend model
        require(['Input/Intel/RealSense/Sense Type/Hands/Extensions/Alerts'], function (alertExtensions) {
            alertExtensions.ExtendClasses();
        })

        intel.realsense.hand.HandModule.activate(sense).then(function (result) {
            handModule = result;

            // Set the on connect handler
            sense.onDeviceConnected = onConnect;

            var device = {
                Name: 'RealSense',
                Manufacturer: 'Intel',
                Device: handModule,
                Helper: helper
            }

            // Add RealSense to Device Manager
            deviceManager.Add(source, device, function () {
                return connected;
            });

            // Set the status handler
            sense.onStatusChanged = onStatus;

            // Set the data handler
            handModule.onFrameProcessed = onHandData;

            // SenseManager Initialization
            return sense.init();
        }).then(function (result) {

            // Configure Hand Tracking
            return handModule.createActiveConfiguration();
        }).then(function (result) {
            handConfig = result;

            // Enable all alerts
            handConfig.allAlerts = true;

            // Enable all gestures
            handConfig.allGestures = useNativeGestures;

            // Apply Hand Configuration changes
            return handConfig.applyChanges();
        }).then(function (result) {
            return handConfig.release();
        }).then(function (result) {

            // Start Streaming
            return sense.streamFrames();
        }).then(function (result) {
            var test;
        }).catch(function (error) {
            // handle pipeline initialization errors
            //TODO Handle ERRORS
        });
    }


    return {
        Start: Start
    }
});