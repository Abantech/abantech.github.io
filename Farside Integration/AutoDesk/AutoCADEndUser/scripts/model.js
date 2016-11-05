var viewModels = [
{ id: "racsimple", label: "Revit House", authService: "//abantech-demo.cloudapp.net/AuthenticationService/AutoDeskAuthNService.AuthNService.svc/GetAuthToken", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA3LTE2LTIxLTIwLTEzLW1hdHZ6ZW05MmJjdW9xNnJlZ2R0Y2RudXYyd2svcmFjX2Jhc2ljX3NhbXBsZV9wcm9qZWN0LnJ2dA==" },
{ id: "racadvanced", label: "Revit School", authService: "//abantech-demo.cloudapp.net/AuthenticationService/AutoDeskAuthNService.AuthNService.svc/GetAuthToken", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA3LTI5LTIxLTEwLTQzLXdxbWpzN3FyZXN0dGtxYXV3NGdxa3phanZoZG8vcmFjX2FkdmFuY2VkX3NhbXBsZV9wcm9qZWN0LnJ2dA==" },
{ id: "crland", label: "Costa Rica Land", authService: "//abantech-demo.cloudapp.net/AuthenticationServiceAbantech/Authentication.svc/GetAuthToken", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWJhbnRlY2hkZW1vbW9kZWxzL0hJR1VJVE8lMjAyMS0xMC0xMCUyMGRlZmluaXRpdm8uZHdn" },
{ id: "cowcatcher", label: "Cow Catcher", authService: "//abantech-demo.cloudapp.net/AuthenticationServiceAbantech/Authentication.svc/GetAuthToken", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWJhbnRlY2hkZW1vbW9kZWxzL0NvdyUyMENhdGNoZXIuaXB0" },
{ id: "wheel", label: "Wheel", authService: "//abantech-demo.cloudapp.net/AuthenticationServiceAbantech/Authentication.svc/GetAuthToken", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWJhbnRlY2hkZW1vbW9kZWxzL1doZWVsLmlwdA" },
{ id: "Greghouse", label: "Greghouse", authService: "//abantech-demo.cloudapp.net/AuthenticationServiceAbantech/Authentication.svc/GetAuthToken", urn: "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWJhbnRlY2hkZW1vbW9kZWxzL1NpbXBsZUhvdXNlLmRhZQ" }
];

var querystring = window.location.search;
var currentModel = 5;

if (querystring !== "") {
    var params = {}, queries, temp, i, l;
    querystring = querystring.substring(1, querystring.length);

    // Split into key/value pairs
    queries = querystring.split("&amp;");

    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    if (params["model"]) {
        currentModel = params["model"];
    }
}

var authServiceUrl = viewModels[currentModel].authService;

var viewer3D;
var viewer2D;

var metadata;

var _blockEventMain = false;
var _blockEventSecondary = false;

$(document).ready(function () {

    //  get and refresh token function
    var getToken = function () {
        var accessToken;

        $.ajax({
            type: "GET",
            url: authServiceUrl,
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

            var viewer2DContainer = document.getElementById("viewer2D");
            viewer2D = new Autodesk.Viewing.Private.GuiViewer3D(viewer2DContainer, {});

            viewer2D.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (event) {
                viewer2D.toolbar.setVisible(false); // hide the tool bar in 2d viewer
            });

            viewer3D.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (event) {
                panelDisabled = false;  // enable panel after geometry loaded
                initializeMarker();     // init marker layer
            });

            viewer3D.start();
            viewer2D.start();

            // select object with same dbId in 3d viewer
            viewer3D.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (event) {
                if (_blockEventSecondary)
                    return;
                _blockEventMain = true;
                viewer2D.select(viewer3D.getSelection());
                _blockEventMain = false;
            });

            // select object with same dbId in 2d viewer
            viewer2D.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function (event) {
                if (_blockEventMain)
                    return;
                _blockEventSecondary = true;
                viewer3D.select(viewer2D.getSelection());
                _blockEventSecondary = false;
            });

            loadDocument(viewModels[currentModel].urn);
        });
    }

    initialize();
    metadata = JSON.parse(rac); // read hardwired location data for coordinate system mapping
    initDraggableDiv();         // init draggable behavieor for viewer2D container

});

function loadDocument(urnStr, cb3d, cb2d) {

    // disable panel while loading document
    panelDisabled = true;

    var urn = "urn:" + urnStr;
    Autodesk.Viewing.Document.load(urn,

        // onSuccessCallback
        function (document) {
            var geometryItems3D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), { 'type': 'geometry', 'role': '3d' }, true);
            var geometryItems2D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), { 'type': 'geometry', 'role': '2d' }, true);

            viewer3D.load(document.getViewablePath(geometryItems3D[0]), null, function () {
                if (cb3d) cb3d();
            });
            viewer2D.load(document.getViewablePath(geometryItems2D[0]), null, function () {
                if (cb2d) cb2d();
            });
        },

        // onErrorCallback
        function (msg) {
            console.log("Error loading document: " + msg);
        }
    );
}