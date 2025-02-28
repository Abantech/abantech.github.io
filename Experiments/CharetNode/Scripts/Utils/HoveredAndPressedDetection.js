﻿var raycaster = new THREE.Raycaster();
var useScreenTapGesture = true;

var isButtonPressed = function (frame, button) {
    var isObjectIntersected = false;
    
    frame.hands.forEach(
      function (hand) {

          if (useScreenTapGesture)
          {
              if (isHoveringOverControls(hand, [button])) {
                  if (typeof (hand.frame.controller.frame(1)) != "undefined") {
                      var indexFinger = hand.fingers[1];
                      var prevIndexFinger = hand.frame.controller.frame(1).pointablesMap[indexFinger.id];

                      if (typeof (prevIndexFinger) != "undefined" && 
                          typeof(prevIndexFinger.touchDistance) != "undefined" &&
                          prevIndexFinger.touchDistance <= 0 && 
                          indexFinger.touchDistance > 0)
                      {
                          isObjectIntersected = true;
                      }
                  }
              }
          }
          else
          {
              var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
              var directionVector = (new THREE.Vector3()).fromArray(hand.fingers[1].direction);

              raycaster.set(indexTipPosition, directionVector.normalize());
              raycaster.near = 0;
              raycaster.far = 80;

              if (raycaster.intersectObject(button, true).length > 0)
                  isObjectIntersected = true;
          }

      }
    );

    return isObjectIntersected;
}

var isHoveringOverControls = function (hand, controls) {
    //if (!minHoverDistance)
    //    minHoverDistance = 80

    var indexTipPosition = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
    var directionVector = (new THREE.Vector3()).fromArray(hand.fingers[1].direction);
    raycaster.set(indexTipPosition, directionVector.normalize());
    raycaster.far = 400;

    var intersection = raycaster.intersectObjects(controls, true);
    return intersection.length > 0;
}