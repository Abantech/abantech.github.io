define(['postal'], function (bus) {
    return {
        Initialize: function () {
            bus.subscribe({
                channel: "SystemNotification",
                topic: "*",
                callback: function (data, envelope) {
                    console.log(envelope.topic + ": " + data.message);
                }
            });
        }
    }
});