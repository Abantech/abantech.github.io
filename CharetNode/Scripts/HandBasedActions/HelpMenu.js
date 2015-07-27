/// <reference path="../../Libs/THREEJS/three.js" />
/// <reference path="../FrameActions.js" />
var buttonSize = 40;
var buttonOffsetFactor = 1.1
var buttonPositionX = (window.innerWidth / 14);
var buttonPositionY = (window.innerHeight / 12);
var buttonPositionZ = -300;
var menuHoverToOpenDelayMills = 250;
var menuOpenGracePeriodMills = 900;
var url = window.location.href;

//var texture = new THREE.Texture(img);
var geometry = new THREE.SphereGeometry(16, 32, 32);
geometry.applyMatrix(new THREE.Matrix4().makeTranslation(buttonPositionX, buttonPositionY, buttonPositionZ));

var material = new THREE.MeshPhongMaterial({ wireframe: false });

if (url.substring(0, 4) != "file")
{
    var texture = new THREE.Texture();

    //console.log("window.location : " + window.location.href);
    if (url.substring(0, 4) != "file")
    {
        var image = document.createElement('img');
        image.src = 'Images/NewShapeMenu.jpg';
        texture = new THREE.Texture(image);
        image.onload = function ()
        {
            texture.needsUpdate = true;
        };
    }

    material.map = texture;
    material.needsUpdate = true;
}
else
{
    material.color.setHex(0x8A2908);
}
