var bus = require('postal');
var ami = require('../Asset Management And Inventory/AssetManager.js');
var source = "Efficio Constraints Engine";
var violated = false;

var subscriptions = new Array();

function RegisterSubscriber(subscription) {
    subscriptions.push(subscription);
}

function CheckConstraints(data){
    if (violated) {
        console.log('Constraints violated, changes not reflected internally.')
    }
    else {
        console.log('Constraints not violated, changes reflected internally.')
    }

    return !violated;
}

module.exports = {
    Initialize: function () {
        RegisterSubscriber(
            bus.subscribe({
                channel: "Asset",
                topic: "Create",
                callback: function (data, envelope) {
                    if (envelope.source != source) {
                        if (CheckConstraints(data.asset)) {
                            ami.CreateAsset(data.asset);
                        } else {

                        }

                        violated = !violated;
                    }
                }
            }));
        
        RegisterSubscriber(
            bus.subscribe({
                channel: "Asset",
                topic: "Update",
                callback: function (data, envelope) {
                    if (envelope.source != source) {
                        if (CheckConstraints(data.asset)) {
                            ami.UpdateAsset(data.asset);
                        } else {

                        }

                        violated = !violated;
                    }
                }
            }));
        
        RegisterSubscriber(
            bus.subscribe({
                channel: "Asset",
                topic: "Delete",
                callback: function (data, envelope) {
                    if (envelope.source != source) {
                        if (CheckConstraints(data.asset)) {
                            ami.DeleteAsset(data.asset);
                        } else {

                        }

                        violated = !violated;
                    }
                }
            }));
    },
    
    Dispose: function () {
        for (sub in subscriptions) {
            sub.unsubscribe();
        }
    }
};