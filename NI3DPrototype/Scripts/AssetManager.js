//These classes area meant to help with introducting/manipulating assets
//Create, Cut, Copy, Paste, Undo, Redo, etc
function AssetManager()
{
    var assets = [];
    var selectedAssets = [];

    var createAssetAction;

    this.CreateAsset = function (assetType, asset)
    {
        window.scene.add(asset);

        asset.isAsset = true;
        asset.name = assetType + " " + mesh.id;

        if (!createAssetAction)
        {
            createAssetAction = new CreateAction();
            createAssetAction.Initialize(asset);

            actionManager.ActionPerformed(createAssetAction);

            createAssetAction = null;
        }

        assets.push(asset);
    }

    this.GetAssets = function ()
    {
        return assets;
    }

    this.SelectAsset = function (asset)
    {
        selectedAssets.push(asset);
    }

    this.SelectAllAssets = function ()
    {
        selectedAssets = assets;
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
                selectedAssets.splice(i, 1);
            }
        }
    }

    this.DeselectAllAssets = function ()
    {
        selectedAssets = [];
    }
}

var assetManager = new AssetManager();