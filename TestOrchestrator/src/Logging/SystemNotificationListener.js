var bus = require('postal');

module.exports = {
    Initialize: function ()
    {
        bus.subscribe({
            channel: "SystemNotification",
            topic: "*",
            callback: function (data, envelope) {
                console.log(envelope.topic + ": " + data.message);
            }
        });
    }
}