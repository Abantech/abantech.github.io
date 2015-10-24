var Kinect2 = require('kinect2');

var bus = require('postal');
var source = 'Kinect';

var controller;

// Helpful Link: http://www.webondevices.com/get-started-with-xbox-kinect-2-javascript-development/ 

module.exports =
{
    Initialize: function () {
        
        controller = new Kinect2();
             
        // Open and returns true if suceeds
        controller.open("connect", function () {
            bus.publish({
                channel: 'Devices',
                topic: 'Connected',
                source: source,
                data: {
                    name : source,
                    device : Kinect2,
                    controller: controller
                }
            });
        });
        
        
        //listen for body frames
        controller.on('bodyFrame', function (bodyFrame) {
            
            for (var i = 0; i < bodyFrame.bodies.length; i++) {
                if (bodyFrame.bodies[i].tracked) {
                    
                    // log body frame
                    console.log(bodyFrame.bodies[i]);
                    

                    bus.publish({
                        channel: 'Input.Raw',
                        topic: 'Body Frame',
                        source: source,
                        data: {
                            name : bodyFrame.bodies[i],
                            gesture: bodyFrame.bodies
                        }
                    });
                }
            }
        });
            

            
            //request body frames
            //controller.openBodyReader();
        
        
    },
    
    Start: function () {
        
        controller.loop(function (frame) {
            if (frame.valid) {
                bus.publish({
                    channel: 'Input.Raw',
                    topic: 'Kinect',
                    source: source,
                    data: {
                        input : frame
                    }
                });
            }
        });
    }
}