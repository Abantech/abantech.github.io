define(['postal'], function (bus) {
    var source = 'Event Manager';

    function RaiseEvent(eventName, data) {
        bus.publish({
            channel: source,
            topic: eventName,
            source: source,
            data: data
        });
    }

    return {
        Initialize: function () {
            return {
                RaiseEvent: RaiseEvent
            }
        }
    }
});