define(['postal', 'Asset Management and Inventory/AssetManager'], function (bus, ami) {
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

    return{
        Initialize: function () {

        }
    };
});
