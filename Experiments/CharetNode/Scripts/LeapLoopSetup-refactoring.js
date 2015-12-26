Leap.loop(
        function (frame) {
            frame.hands.forEach(
              function (hand) {
                  if (handController)
                      handController.RunAllActions(hand);
              }
            )

            if (frameActions)
                frameActions.RunAllActions(frame);
        }
    )
// note that transform must be _before_ rigged hand
.use('transform', {
    quaternion: new THREE.Quaternion,
    position: new THREE.Vector3(0, -50, 0),
    scale: .5
})

Leap.loopController.use('riggedHand', {
    scale: 1,
    parent: scene,
    renderFn: function () { } //prevent from using the default renderFn as it is unecessary and will throw an error
})

//not really sure why the next line is needed anymore
window.transformPlugin = Leap.loopController.plugins.transform;