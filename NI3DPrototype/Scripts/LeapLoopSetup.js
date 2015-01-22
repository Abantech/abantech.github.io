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
    position: new THREE.Vector3,
    scale: 0.7
})
.use('riggedHand', {
    dotsMode: false,
    parent: scene,
    renderFn: function () {
        renderer.render(scene, camera);
    }

})
.connect();

window.transformPlugin = Leap.loopController.plugins.transform;