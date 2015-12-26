/// <reference path="Libs/Leap/leap-0.6.4.js" />
/// <reference path="Libs/Leap/leap-plugins-0.1.10.js" />
/// <reference path="Libs/Leap/leap-plugins-0.1.10-utils.js" />
/// <reference path="Libs/Leap/leap-widgets-0.1.0.js" />
/// <reference path="Libs/Leap/leap.rigged-hand-0.1.5.js" />

var ibox;
var riggedHandPlugin;
//Leap loop to call drawing functions
Leap.loop(
  function (frame) {
      if (riggedHandPlugin) {
          if (!scene) {
              initMyScene(riggedHandPlugin.parent);
              AddFogAndLighting(riggedHandPlugin.parent);
          }

      
      ibox = frame.interactionBox;
      frame.hands.forEach(
            function (hand) {
                if (hand.type == "right") {
                    var handGesture = new HandGesture(hand, riggedHandPlugin.parent);
                    if (currentScene)
                        TryDrawObject(handGesture);
                }
                else if (hand.type == "left") {
                    var handMesh = hand.data('riggedHand.mesh');

                }
            }
       )

          if (riggedHandPlugin && !scene) {
              initMyScene(riggedHandPlugin.parent);
              AddFogAndLighting(riggedHandPlugin.parent);
          }
      }
  }
)
.use('riggedHand')
.use('handEntry')

riggedHandPlugin = Leap.loopController.plugins.riggedHand;

var currentScene = function() {
    return riggedHandPlugin.parent;
}

//Leap.loopController.on('frame', function (frame) {
//    var hand;

//    if (!scene)
//        initMyScene(riggedHandPlugin.parent);

//    if (!sceneFog)
//        AddFogAndLighting(riggedHandPlugin.parent);
//});

Leap.loopController.use('boneHand', {
    renderer: riggedHandPlugin.renderer,
    scene: riggedHandPlugin.parent,
    camera: riggedHandPlugin.camera,
    render: function () { }
})



//var prevTexture