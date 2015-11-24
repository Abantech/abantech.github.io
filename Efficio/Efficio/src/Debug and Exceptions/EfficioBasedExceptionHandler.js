var bus = require('postal');
var source = "Efficio Exception Propagator"

module.exports = {
    Initialize: function () {
        bus.subscribe({
            channel: "Exception.*",
            topic: "*",
            callback: function (data, envelope) {
                bus.publish({
                    channel: "UserNotification",
                    topic: "Error",
                    source: source,
                    data: {
                        message: envelope.source + ": " + data.message
                    }
                });
            }
        });
    }
};