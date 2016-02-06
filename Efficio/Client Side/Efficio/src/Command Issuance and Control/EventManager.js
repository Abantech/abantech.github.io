define(['postal'], function (bus) {
    var source = 'Event Manager';

    function RaiseEvent(eventSource, eventName, data) {
        bus.publish({
            channel: eventSource,
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