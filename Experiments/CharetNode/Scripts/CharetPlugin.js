var Leap;

CharetPlugin = {
    DeviceRegistered: function (Name, Device, ctrl)
    {
        if (Name === 'Leap Motion')
        {
            Leap = Device;

            ctrl.use('transform', {
                quaternion: new THREE.Quaternion,
                position: new THREE.Vector3(0, -50, 0),
                scale: .5
            });

            window.transformPlugin = ctrl.plugins.transform;

            ctrl.use('riggedHand', {
                scale: 1,
                parent: scene,
                renderFn: function () { } //prevent from using the default renderFn as it is unecessary and will throw an error
            });

            leapToSceneConverter.Initialize();
            leapToSceneConverter.AttachRotationConverter();
            leapToSceneConverter.AttachScaleConverter();
            leapToSceneConverter.AttachPositionConverter();
        }
    },
    LeapInput: function (Frame)
    {
        Frame.hands.forEach(
             function (hand)
             {
                 if (handController)
                     handController.RunAllActions(hand);
             }
           )

        if (frameActions)
            frameActions.RunAllActions(Frame);
    },
    UpdateScene: function (Assets)
    {
        Assets.forEach(function (asset)
        {
            assetManager.UpdateAsset(asset);
        });
    }
}

AudioCommands = {
    "make :size (foot) :color container": makeContainerByVoice,
    "create :size (foot) :color container": makeContainerByVoice,
    "make :size (foot) :color box": makeContainerByVoice,
    "create :size (foot) (:color) box": makeContainerByVoice,
    "restart": Restart,
    "reload": Restart,
    "start over": Restart,
    "turn rotation snapping :snapping": toggleRotationSnapping,
    "turn snapping :snapping": toggleTranslationSnapping,
    "set snap to :degrees degrees": setSnapAngle,
    "set snap to :pixels pixels": setSnapSize,
    "turn rotation :rotation": toggleRotation,
    "set rotation axis to :axis": setRotationAxis,
    //"set translation axis to :axis": setTranslationAxis
}

function Restart()
{
    location.reload();
}