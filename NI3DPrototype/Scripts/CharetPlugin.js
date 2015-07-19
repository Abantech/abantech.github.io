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
             function (hand) {
                 if (handController)
                     handController.RunAllActions(hand);
             }
           )

        if (frameActions)
            frameActions.RunAllActions(Frame);
    }
}

AudioCommands = {
    "make :size (foot) container": makeContainerByVoice,
    "create :size (foot) container": makeContainerByVoice,
    "make :size (foot) box": makeContainerByVoice,
    "create :size (foot) box": makeContainerByVoice,
    "restart": Restart,
    "reload": Restart,
    "start over": Restart,
    "turn snapping :snapping": toggleSnapping,
    "set snap to :degrees degrees": setSnapAngle,
    "turn rotation :rotation": toggleRotation,
    "set rotation axis to :axis": setRotationAxis
}

function Restart()
{
    location.reload();
}