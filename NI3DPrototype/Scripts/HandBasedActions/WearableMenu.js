/// <reference path="../../Libs/THREEJS/three.js" />
/// <reference path="../FrameActions.js" />
/// <reference path="../HandController.js" />
/// <reference path="../AssetManager.js" />
/// <reference path="MenuButtonChildOption.js" />

var wearable = Wearable();
var copiedObjects = [];
var leftHandLastVisible = new Date();
var leftHandRecentlyVisible = function (frame) { return (new Date() - leftHandLastVisible < 50); }
var leftHandNotRecentlyVisible = function (frame) { return (new Date() - leftHandLastVisible > 50); }
var lastTimeButtonPressedDictionary = {};
var leftHandPalmPosition = new THREE.Vector3(0, 0, 0);

function Wearable() {
    //Arm
    var wearable = new THREE.Object3D();
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, ambient: 666666, side: 2, transparent: true, opacity: 0.4 });
    material.transparent = true;
    material.opacity = 0.3;
    var geometry = new THREE.CylinderGeometry(18, 35, 300, 80);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-0.5 * Math.PI));
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 200));
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(1, 0.8, 1);
    wearable.add(mesh);

    return wearable;
}

var pasteSelectedObjects =
    function (button) {
        console.log("Pasting " + copiedObjects.length + " copied objects");
        for (var i = 0; i < copiedObjects.length; i++) {
            //assetManager.CreateAsset("CopyOf" + copiedObjects[i].name, copiedObjects[i]);
            assetManager.CreateAsset("CopiedObject", copiedObjects[i]);
            copiedObjects[i].position.copy(leftHandPalmPosition);
        }
    };

var copyOrCutSelectedObjects =
    function (buttonMesh, isCutOperation) {
        //re-initialize the array - overwrite the "clipboard"
        copiedObjects = [];
        var selectedAssets = assetManager.GetSelectedAssets();

        console.log("Copying " + selectedAssets.length + " assets");
        for (var i = 0; i < selectedAssets.length; i++) {
            copiedObjects.push(selectedAssets[i].clone());
            if (isCutOperation)
                window.scene.remove(selectedAssets[i])
        }

    }

var createWearableButton = function (displayText, colorHex, positionX, positionY, positionZ, rotationY, onPressedCallback, isPressableCheck) {
    new menuButtonChildOption(displayText + "Button", 25, { color: colorHex, ambient: 666666, side: 2, transparent: true, opacity: 0.4 },
        function (mbco) {
            mbco.buttonMesh.position.set(positionX, positionY, positionZ);
            var text = new THREE.TextGeometry(displayText, { size: 3, height: 1, weight: "bold" });
            mbco.buttonMesh.add(new THREE.Mesh(text, new THREE.MeshPhongMaterial(mbco.meshParameters)))
            mbco.buttonMesh.rotation.y = rotationY;
            wearable.add(mbco.buttonMesh);
        },
        leftHandRecentlyVisible,
        leftHandNotRecentlyVisible,
        onPressedCallback,
        null,
        isPressableCheck,
        function (button) {
            button.material.opacity = 0.8;
        },
        function (button) {
            button.material.opacity = 0.4;
        },
        null
    );
}

createWearableButton("Paste", 0xDBA901, 20, 0, 65, 1.5, pasteSelectedObjects,
        function (button) { return copiedObjects.length > 0; }
    );

createWearableButton("Copy", 0x2E2EFE, 20, 0, 95, 1.6, function (button) { copyOrCutSelectedObjects(button, false); },
        function (button) { return assetManager.GetSelectedAssets().length > 0; }
    );

createWearableButton("Cut", 0x7401DF, 24, 0, 125, 1.8, function (button) { copyOrCutSelectedObjects(button, true); },
        function (button) { return assetManager.GetSelectedAssets().length > 0; }
    );

window.scene.add(wearable);

var moveWearableWithHand = {
    action: function (hand)
    {
        if (hand.type === 'left') {
            wearable.position.set(hand.stabilizedPalmPosition[0], hand.stabilizedPalmPosition[1], hand.stabilizedPalmPosition[2]);
            wearable.rotation.set(hand.pitch(), -hand.yaw(), hand.roll());
            leftHandLastVisible = new Date();
            leftHandPalmPosition = new THREE.Vector3().fromArray(hand.fingers[1].tipPosition)
                //fromArray(hand.stabilizedPalmPosition[0], hand.stabilizedPalmPosition[1], hand.stabilizedPalmPosition[2]);
        }
    }
}

handController.RegisterAction("MoveWearableWithHand", moveWearableWithHand);
frameActions.RegisterAction("HideArmOnLeftHandNotDetected", function (frame) { wearable.visible = leftHandRecentlyVisible(frame); });