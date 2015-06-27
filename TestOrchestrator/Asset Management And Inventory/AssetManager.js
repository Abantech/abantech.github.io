var bus = require('postal');
var source = "Efficio Asset Manager"

function CreateAsset(asset) {
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
    console.log('Asset updated with data: ' + asset);
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