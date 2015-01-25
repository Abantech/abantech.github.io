var pinchGesture =
    {
        gestureHasBegun: false,

        options:
        {
            distance: 15,
            delay: .750,
            range: 50,
            scaleWithScene: true
        },

        onBeginGesture: null,

        onGesture: null,

        onEndGesture: null,

        action: function (hand)
        {
            if (!pinchGesture.gestureTimer)
            {
                pinchGesture.gestureTimer = new GestureTimer();
            }

            var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);
            var thumbTipVector = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);

            var pinchDistance = pinchGesture.options.distance;

            if (pinchGesture.options.scaleWithScene)
            {
                pinchDistance = pinchDistance * transformPlugin.getScale().x;
            }

            if (mathHelper.DistanceBetweenPoints(indexTipVector, thumbTipVector) < pinchDistance)
            {
                if (!pinchGesture.gestureHasBegun)
                {
                    gestureHasBegun = true;

                    if (pinchGesture.onBeginGesture && typeof pinchGesture.onBeginGesture === "function")
                    {
                        pinchGesture.onBeginGesture(hand);
                    }
                }

                if (pinchGesture.gestureTimer.timeGesture(pinchGesture.options.delay))
                {
                    if (pinchGesture.onGesture && typeof pinchGesture.onGesture === "function")
                    {
                        pinchGesture.onGesture(hand);
                    }
                }
            }
            else
            {
                pinchGesture.gestureTimer.resetTimer();
                pinchGesture.gestureHasBegun = false;

                if (pinchGesture.onEndGesture && typeof pinchGesture.onEndGesture === "function")
                {
                    pinchGesture.onEndGesture(hand);
                }
            }
        }
    }