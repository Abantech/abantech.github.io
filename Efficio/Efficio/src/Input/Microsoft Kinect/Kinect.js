define(['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = 'Microsoft Kinect';
    var TrackingType = 'Body';
    var controller;
    var device = "Kinect";
    var jointWrapper;

    function configure(KinectConfiguration) {
        KinectConfiguration = {
            Host: KinectConfiguration.Host || "ws://localhost:8181"
        }

        return KinectConfiguration;
    }

    return {
        Initialize: function (KinectConfiguration) {

            // Retrieve Joint Helper

            require(['Input/Microsoft Kinect/JointWrapper'], function (jw) {
                jointWrapper = jw;
            });

            // Load Configuration
            KinectConfiguration = configure(KinectConfiguration);

            // Create Controller
            controller = new WebSocket(KinectConfiguration.Host);
            // Sends message when controller is connected
            controller.onopen = function ()
            {
                console.log("Connection successful.");

                // ISMAEL: Device connection notification has been migrated to the Device Manager. Use the leap motion input as an example on how to use it
                // Add WebSocket to Device Manager
                deviceManager.Add(source, controller);
                deviceManager.Devices[source].IsConnected = function () {
                    return true;
                }
                
            };

            // Connection closed.
            controller.onclose = function () {
                    console.log("Connection closed.");

            }
        },

        Start: function () {

            // Listens for input from device
            controller.onmessage = function (frame)
            {
                var kinectFriendly = [];
               
               var skeleton = JSON.parse(frame.data);
               skeleton.Joints.forEach(function (joint)
               {
                   var specialJoint = new jointWrapper.SpecialJoint(joint);
                   kinectFriendly.push(specialJoint);
               });

               // ISMAEL: Consider just extending the joint object. Eliminate the need for object copying.
               //skeleton.Joints.forEach(function (joint) {
               //    // Get the Joint Type and Tracking Status
               //    joint.FriendlyName = jointHelper.GetJointName(joint.JointType);
               //    joint.TrackingStatus = jointHelper.GetJointTrackingStatus(joint.TrackingState);
               //});

               // ISMAEL: Tell me if you think this would be a useful function to expose
               //skeleton.FindJointByFriendlyName = function (friendlyName) {
               //    var returnJoint = this.Joints.filter(function (value) {
               //        value.FriendlyName === friendlyName
               //    });

               //    if (returnJoint && returnJoint.lenght > 0) {
               //        return returnJoint[0];
               //    }

               //    return null;
               //}

                bus.publish
                ({
                    channel: 'Input.Raw',
                    topic: device,
                    source: source,
                    data:
                    {
                        TrackingType: TrackingType,
                        input: kinectFriendly
                    }
                });
            };
        }
    }
});