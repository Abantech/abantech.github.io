define(['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = 'Microsoft Kinect';
    var TrackingType = 'Body';
    var controller;
    var device = "Kinect";
    var jointHelper;
    var connected = false;

    function configure(KinectConfiguration) {
        KinectConfiguration = {
            Host: KinectConfiguration.Host || "ws://localhost:8181"
        }

        return KinectConfiguration;
    }

    return {
        Initialize: function (KinectConfiguration) {

            // Retrieve Joint Helper
            require(['Input/Microsoft Kinect/JointHelper'], function (jh) {
                jointHelper = jh;
            });

            // Load Configuration
            KinectConfiguration = configure(KinectConfiguration);

            // Create Controller
            controller = new WebSocket(KinectConfiguration.Host);

            // Sends message when controller is connected
            controller.onopen = function ()
            {
                console.log("Connection successful.");
                connected = true;

                var device = {
                    Name: 'Kinect',
                    Manufacturer: 'Microsoft',
                    Device: controller
                }

                // ISMAEL: Device connection notification has been migrated to the Device Manager. Use the leap motion input as an example on how to use it
                // Add WebSocket to Device Manager
                // TODO: See if device can return connection status
                deviceManager.Add(source, device, function () {
                    return connected;
                });                
            };

            // Connection closed.
            controller.onclose = function () {
                    console.log("Connection closed.");
                    connected = false;
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
                   // Get the Joint Type and Tracking Status
                   var jointType = jointHelper.GetJointName(joint.JointType);
                   var jointTracking = jointHelper.GetJointTrackingStatus(joint.TrackingState);
                   var jointFriendly = { JointType: jointType, TrackingState: jointTracking, Joint: joint };

                   kinectFriendly.push(jointFriendly);
               });

                // ISMAEL: Consider just extending the joint object. Eliminate the need for object copying.

               skeleton.Joints.forEach(function (joint) {
                   // Get the Joint Type and Tracking Status
                   joint.FriendlyName = jointHelper.GetJointName(joint.JointType);
                   joint.TrackingStatus = jointHelper.GetJointTrackingStatus(joint.TrackingState);
                   jointHelper.AddExtensions(joint);
               });

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
                    channel: 'Input.Raw.Human',
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