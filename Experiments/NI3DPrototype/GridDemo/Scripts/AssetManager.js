//These classes area meant to help with introducting/manipulating assets
//Create, Cut, Copy, Paste, Undo, Redo, etc
function AssetManager() {
    var managedAssets = {};
    var modifiedAssets = [];
    var revertedAssets = [];

    this.CreateAsset = function (asset) {
        window.scene.add(asset);
        var managedAsset = new ManagedAsset(asset);
        managedAssets[asset.uuid] = managedAsset;
        modifiedAssets.push(managedAsset);
    }

    //this should get triggered as any asset changes occur to an asset
    this.OnBeforeAlterAsset = function (asset) {
        managedAssets[asset.uuid].SaveCurrentState(asset);

        //Same asset being modified again (a 2nd or subsequent time)
        if (modifiedAssets.length > 0 && modifiedAssets[modifiedAssets.length - 1] == managedAssets[asset.uuid] ) {
            //TODO: do we need to do anything here?
        }
        else
        {
            modifiedAssets.push(managedAssets[asset.uuid]);
        }
    }

    this.UndoLast = function () {
        if (modifiedAssets.length > 0) {
            var modifiedAsset = modifiedAssets.pop();
            //Add it to the other array so that we can "redo"
            revertedAssets.push(modifiedAsset);
            var previousStateOfAsset = modifiedAsset.GetPreviousState();
            if (previousStateOfAsset)
            {
                previousStateOfAsset.visible = true;
            }
            else
            {
                window.scene.remove(modifiedAsset);
            }
        }
    }
}

function ManagedAsset(asset) {
    var previousAssetStates = [];

    this.Asset = asset;

    this.SaveCurrentState = function(asset) {
        //TODO: Capture the current state of the asset so that we can revert back to it if needed

        //HACK: just clone and hide the old one for now
        var oldAsset = asset.clone();
        oldAsset.visible = false; 
        previousAssetStates.push(oldAsset);
    }

    this.GetPreviousState = function () {
        return previousAssetStates.length > 0 ? previousAssetStates.pop() : null;
    }
}