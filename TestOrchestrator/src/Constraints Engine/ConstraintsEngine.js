var bus = require('postal');
var ami = require('../Asset Management And Inventory/AssetManager.js');
var source = "Efficio Constraints Engine";
var violated = false;

var subscriptions = new Array();

function RegisterSubscriber(subscription) {
    subscriptions.push(subscription);
}

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

    }
};