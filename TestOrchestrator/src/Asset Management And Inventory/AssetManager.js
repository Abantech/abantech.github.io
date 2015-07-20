var three = require('three');
var internalScene = require('../InternalScene');
var bus = require('postal');
var source = "Efficio Asset Manager"

function CreateAsset(asset) {
    bus.publish({
        channel: "UserNotification",
        topic: "AssetCreated",
        source: source,
        data: {
            message: "Asset created with data: " + asset
        }
    });
    
    internalScene.Scene.add(asset);
};

function CreateAssets(assets) {

};

function RetrieveAsset(assetID) {

};

function RetrieveAssets(assetIDs) {

};

function RetrieveAllAssets() {

};

function RetrieveAllAssetIDs() {

};

function UpdateAsset(asset) {
    var oldAsset = internalScene.Scene.getObjectById(asset.id);
    
    internalScene.Scene.remove(oldAsset);
    internalScene.Scene.add(asset);
    
    asset = internalScene.Scene.getObjectById(asset.id);
    
    bus.publish({
        channel: "UserNotification",
        topic: "AssetUpdated",
        source: source,
        data: {
            message: source + " - Asset Updated: \nID: " + asset.id + "\nPosition: (" + asset.position.x + " , " + asset.position.y + ", " + asset.position.z + ")" + "\nScale: (" + asset.scale.x + " , " + asset.scale.y + ", " + asset.scale.z + ")"
        }
    });
};

function UpdateAssets(assets) {

};

function DeleteAsset(assetID) {

};

function DeleteAssets(assetIDs) {

};

function DeleteAllAssets() {

};

function GetValueForProperty(property, data) {
    switch (property) {
        case "ClosestAsset":
            {
                return GetClosestAsset(data);
            }
    }
}

function GetClosestAsset(data) {
    if (data.location === null) {
        bus.publish({
            channel: "Exception.Efficio",
            topic: "GetClosestAsset",
            source: source,
            data: {
                message: "GetClosestAsset function requires location argument"
            }
        });
    }
    return "Asset closest to point (" + data.Location.x + ", " + data.Location.y + ", " + data.Location.z + ")"
}

module.exports = {
    Initialize: function () {
        if (typeof window != 'undefined') {
            //var http = new XMLHttpRequest();
            //http.open('HEAD', '/debug.html', false);
            //http.send();
            
            //if (http.status != 404) {
            //    var params = [
            //        'height=' + screen.height,
            //        'width=' + screen.width,
            //        'fullscreen=yes' // only works in IE, but here for completeness
            //    ].join(',');
                
            //    window.open('/debug.html', 'AMI Debugger', params);
            //}
        }
    },
    
    CreateAsset: CreateAsset,
    
    CreateAssets: CreateAssets,
    
    RetrieveAsset: RetrieveAsset,
    
    RetrieveAssets: RetrieveAssets,
    
    RetrieveAllAssets: RetrieveAllAssets,
    
    RetrieveAllAssetIDs: RetrieveAllAssetIDs,
    
    UpdateAsset: UpdateAsset,
    
    UpdateAssets: UpdateAssets,
    
    DeleteAsset: DeleteAsset,
    
    DeleteAssets: DeleteAssets,
    
    DeleteAllAssets: DeleteAllAssets,
    
    GetValueForProperty: GetValueForProperty,

};