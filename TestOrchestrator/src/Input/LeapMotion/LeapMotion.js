var Leap = require('leapjs');

require('leapjs-plugins');
require('./plugins/leap.rigged-hand-0.1.5.min.js');

var bus = require('postal');
var source = 'Leap Motion';

var controller;

module.exports =
{
    Initialize: function () {
        controller = new Leap.Controller({ enableGestures: true});

        controller.on("gesture", function (gesture) {
            if (gesture.state == "stop") {
                bus.publish({
                    channel: 'Input.Raw',
                    topic: 'Gesture',
                    source: source,
                    data: {
                        name : gesture.type,
                        gesture: gesture
                    }
                });
            }
        });


        controller.on("connect", function () {
            bus.publish({
                channel: 'Devices',
                topic: 'Connected',
                source: source,
                data: {
                    name : source,
                    device : Leap,
                    controller: controller
                }
            });
        });

        controller.connect();
    },
    
    Start: function () {
        
        controller.loop(function (frame) {
            if (frame.valid) {
                bus.publish({
                    channel: 'Input.Raw',
                    topic: 'Leap',
                    source: source,
                    data: {
                        input : frame
                    }
                });
            }
        });
    }
}