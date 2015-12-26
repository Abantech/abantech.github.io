Leap.loop(
        function (frame) {
            frame.hands.forEach(
              function (hand) {
                  if (typeof (handcontroller) != 'undefined' && handController)
                      handController.RunAllActions(hand);
              }
            )

            if (typeof (frameActions) != 'undefined' && frameActions)
                frameActions.RunAllActions(frame);
        }
    )
// note that transform must be _before_ rigged hand
.use('transform', {
    quaternion: new THREE.Quaternion,
    position: new THREE.Vector3(0,-50,0),
    scale: .5
})
.connect();

window.transformPlugin = Leap.loopController.plugins.transform;