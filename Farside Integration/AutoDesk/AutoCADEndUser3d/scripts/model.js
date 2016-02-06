
var viewModels = [
    { id: "racsimple", label: "Revit House", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA3LTE2LTIxLTIwLTEzLW1hdHZ6ZW05MmJjdW9xNnJlZ2R0Y2RudXYyd2svcmFjX2Jhc2ljX3NhbXBsZV9wcm9qZWN0LnJ2dA=="},
    { id: "racadvanced", label: "Revit School", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA3LTI5LTIxLTEwLTQzLXdxbWpzN3FyZXN0dGtxYXV3NGdxa3phanZoZG8vcmFjX2FkdmFuY2VkX3NhbXBsZV9wcm9qZWN0LnJ2dA=="}
];
var currentModel = 0;

var viewer3D;
var viewer2D;

var metadata;

var _blockEventMain = false;
var _blockEventSecondary = false;

$(document).ready(function() {

        //  get and refresh token function
    var getToken =  function() {
        var accessToken;

        $.ajax({
            type: "GET",
            url: "http://173.73.143.56:3000//AuthService/AutoDeskAuthNService.Service1.svc/GetAuthToken",
            async: false,
            success: function (data) {
                data = JSON.parse(data);
                accessToken = data.access_token;
            }
        });

        return accessToken;
    }

        //  viewer initializer
    function initialize() {
        var options = {
            env: "AutodeskProduction",
            getAccessToken: getToken,
            refreshToken: getToken
        };

        Autodesk.Viewing.Initializer(options, function () {
            
            var viewer3DContainer = document.getElementById("viewer3D");
            viewer3D = new Autodesk.Viewing.Private.GuiViewer3D(viewer3DContainer, {});

            viewer3D.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (event) {
                panelDisabled = false;  // enable panel after geometry loaded    // init marker layer
            });

            viewer3D.start();


                // select object with same dbId in 3d viewer
            viewer3D.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (event) {        
                if (_blockEventSecondary)
                    return;
                _blockEventMain = true;
                _blockEventMain = false;
            });

            loadDocument(viewModels[currentModel].urn);
        });
    }

    initialize();
    metadata = JSON.parse(rac); // read hardwired location data for coordinate system mapping

});

function loadDocument (urnStr, cb3d, cb2d) {

        // disable panel while loading document
    panelDisabled = true;

    var urn = "urn:" + urnStr;
    Autodesk.Viewing.Document.load(urn,

        // onSuccessCallback
        function (document) {
            var geometryItems3D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {'type':'geometry', 'role':'3d'}, true);
            var geometryItems2D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {'type':'geometry', 'role':'2d'}, true);

            viewer3D.load(document.getViewablePath(geometryItems3D[0]), null, function () {if (cb3d) cb3d();});
        },

        // onErrorCallback
        function (msg) {
            console.log("Error loading document: " + msg);
        }
    );
}