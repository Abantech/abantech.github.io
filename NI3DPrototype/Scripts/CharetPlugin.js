CharetPlugin = {
    DeviceRegistered: function (Name, Device, ctrl)
    {
        if (Name === 'Leap Motion')
        {
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
}