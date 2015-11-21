var bus = require('postal');
var source = 'Kinect to BVH Converter';

module.exports =
{
    Initialize: function () {
        bus.subscribe({
            channel: "Input.Raw",
            topic: "Kinect",
            callback: function (data, envelope) {
                // Convert to BVH

            }
        });
    },

    Start: function () {

    }
}