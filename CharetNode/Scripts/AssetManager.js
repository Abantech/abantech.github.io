//These classes area meant to help with introducting/manipulating assets
//Create, Cut, Copy, Paste, Undo, Redo, etc
function AssetManager()
{
    var assets = [];
    var selectedAssets = [];

    var createAssetAction;

    this.CreateAsset = function (assetType, asset, notPhysical)
    {
        window.scene.add(asset);

        if (!notPhysical)
        {
            asset.userData.isAsset = true;
            collidableMeshList.push(asset);
        }

        asset.name = assetType + " " + asset.id;

        if (!createAssetAction)
        {
            createAssetAction = new CreateAction();
            createAssetAction.Initialize(asset);

            actionManager.ActionPerformed(createAssetAction);

            createAssetAction = null;
        }


        assets.push(asset);

        Efficio.MessagingSystem.Bus.publish({
            channel: 'Asset',
            topic: 'Create',
            source: "Charet",
            data: {
                asset: asset,
                physics: !notPhysical
            }
        });
    }

    this.GetAssets = function ()
    {
        return assets;
    }

    this.UpdateAsset = function (asset)
    {
        var sceneAsset = scene.getObjectById(asset.name);

        sceneAsset.position.copy(asset.position);
    }

    this.SelectAsset = function (asset)
    {
        asset.AddHandlesToAsset();
        asset.ChangeAssetColorSelected();

        selectedAssets.push(asset);
    }

    this.SelectAllAssets = function ()
    {
        for (var asset in assets)
        {
            this.SelectAsset(asset);
        }
    }

    this.GetSelectedAssets = function ()
    {
        return selectedAssets;
    }

    this.IsSelectedAsset = function (asset)
    {
        for (var i = 0; i < selectedAssets.length; i++)
        {
            if (asset.name === selectedAssets[i].name)
            {
                return true;
            }
        }

        return false;
    }

    this.DeselectAsset = function (asset)
    {
        for (var i = 0; i < selectedAssets.length; i++)
        {
            if (asset.name === selectedAssets[i].name)
            {
                selectedAssets[i].RemoveHandlesFromAsset();
            selectedAssets[i].ChangeAssetColorDeselected();
                selectedAssets.splice(i, 1);
            }
        }
    }

    this.DeselectAllAssets = function ()
    {
        for (var asset in this.GetSelectedAssets())
        {
            asset.RemoveHandlesFromAsset();
            asset.ChangeAssetColorDeselected();
        }

        selectedAssets = [];
    } 

    var updateBoundingBoxesOfSelectedAssets = function (frame)
    {
        var selectedAssets = assetManager.GetSelectedAssets();

        for (var i = 0; i < selectedAssets.length; i++)
        {
            if (selectedAssets[i].hasBeenMoved)
            {
                selectedAssets[i].geometry.computeBoundingBox();
            }
        }
    }

    frameActions.RegisterAction("UpdateBoundingBoxesOfSelectedAssets", updateBoundingBoxesOfSelectedAssets);
}

var assetManager = new AssetManager();