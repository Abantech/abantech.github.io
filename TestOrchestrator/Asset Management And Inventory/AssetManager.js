var bus = require('postal');
var subscriptions = new Array();
var source = "Efficio Asset Manager"

function RegisterSubscriber(subscription) {
    subscriptions.push(subscription);
}

function CreateAsset(asset) {
    bus.publish({
        channel: "Asset",
        topic: "Create",
        source: source,
        data: {
            asset: asset
        }
    });
    
    console.log('Asset created with data: ' + asset);
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
    bus.publish({
        channel: "Asset",
        topic: "Update",
        source: source,
        data: {
            asset: asset
        }
    });
    
    console.log('Asset updated with data: ' + asset);
};

function UpdateAssets(assets) {

};

function DeleteAsset(assetID) {
    bus.publish({
        channel: "Asset",
        topic: "Delete",
        source: source,
        data: {
            assetID: assetID
        }
    });
};

function DeleteAssets(assetIDs) {

};

function DeleteAllAssets() {

};

module.exports = {
    Initialize: function () {
        RegisterSubscriber(
            bus.subscribe({
                channel: "Asset",
                topic: "Create",
                callback: function (data, envelope) {
                    if (envelope.source != source) {
                        CreateAsset(data.asset);
                    }
                }
            }));
        
        RegisterSubscriber(
            bus.subscribe({
                channel: "Asset",
                topic: "Update",
                callback: function (data, envelope) {
                    if (envelope.source != source) {
                        UpdateAsset(data.asset);
                    }
                }
            }));
        
        RegisterSubscriber(
            bus.subscribe({
                channel: "Asset",
                topic: "Delete",
                callback: function (data, envelope) {
                    if (envelope.source != source) {
                        DeleteAsset(data.asset);
                    }
                }
            }));
    },
    
    Dispose: function () {
        for (sub in subscriptions) {
            sub.unsubscribe();
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
    
    DeleteAllAssets: DeleteAllAssets
};