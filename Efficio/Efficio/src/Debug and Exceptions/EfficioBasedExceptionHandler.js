var bus = require('postal');
var source = "Efficio Exception Propagator"

function CheckConstraints(data) {
    //if (violated) {
    //    console.log('Constraints violated, changes not reflected internally.')
    //}
    //else {
    //    console.log('Constraints not violated, changes reflected internally.')
    //}
    
    return true;
}

//How do we make sure that the ConstraintsEngine is always registered before updates are made to assets?
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