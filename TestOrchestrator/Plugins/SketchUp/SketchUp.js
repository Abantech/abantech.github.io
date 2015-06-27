var bus = require('postal');
var source = 'SketchUp';

var subscriptions = new Array();

function RegisterSubscriber(subscription) {
    subscriptions.push(subscription);
}

function Extrude(){
    console.log("Extrude Called");

    bus.publish({
        channel: "Asset",
        topic: "Update",
        source: source,
        data: {
            asset: 'Extruded Asset'
        }
    });
};

function Translate() {
    console.log("Translate Called");
    
    bus.publish({
        channel: "Asset",
        topic: "Update",
        source: source,
        data: {
            asset: 'Translated Asset'
        }
    });
};

function Create() {
    console.log("Create Called");
    
    bus.publish({
        channel: "Asset",
        topic: "Create",
        source: source,
        data: {
            asset: 'Created Asset'
        }
    });
};

module.exports = 
{
    Initialize: function () {
        RegisterSubscriber(
            bus.subscribe({
                channel: "Input.Processed.Efficio",
                topic: "Pinch",
                callback: function (data, envelope) {
                    console.log('\nPinch Received in Plugin');
                    Extrude(data.input);
                }
            }));

        RegisterSubscriber(
            bus.subscribe({
                channel: "Input.Processed.Efficio",
                topic: "Grasp",
                callback: function (data, envelope) {
                    console.log('\nGrasp Received in Plugin');
                    Translate(data.input);
                }
            }));

        RegisterSubscriber(
            bus.subscribe({
                channel: "Input.Processed.Custom.custom library 1",
                topic: "my custom gesture",
                callback: function (data, envelope) {
                    console.log('\nCustom Gesture Received in Plugin');
                    Create(data.input);
                }
            }));
    }
};