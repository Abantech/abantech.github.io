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
    bus.publish({
        channel: "UserNotification",
        topic: "AssetUpdated",
        source: source,
        data: {
            message: 'Asset updated with data: ' + asset
        }
    });

    var oldAsset = internalScene.Scene.getObjectById(asset.id);

    internalScene.Scene.remove(oldAsset);
    internalScene.Scene.add(asset);
};

function UpdateAssets(assets) {

};

function DeleteAsset(assetID) {

};

function DeleteAssets(assetIDs) {

};

function DeleteAllAssets() {

};

module.exports = {
    Initialize: function () {

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