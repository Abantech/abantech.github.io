var pinchGesture =
    {
        // Tracks wether or not the gesture has already begun.  Used to signal the 'onBeginGesture' to fire.
        gestureHasBegun: false,

        // Tracks wether or not the full gesture (gesture performed for longer than the delay period) was achieved.
        // Passed to the onEndGesture event.
        fullGestureAchieved: false,

        options:
        {
            // Minimum distance between the two fingers to determine if pinch has been achieved
            distance: 15,

            // Minimum time of gesture for full gesture to be achieved
            delay: 1.750,

            // Indicates whether or not to scale the gesture distance with the zoom of the camera
            scaleWithScene: true
        },

        // The collection of functions to be called when the gesture has begun
        onGestureBegin: new Array(),

        // The collection of functions to be called when the full gesture has begun
        onFullGesture: new Array(),

        // The collection of functions to be called when the full gesture has ended
        onFullGestureEnd: new Array(),

        // The collection of functions to be called when the gesture has ended
        onGestureEnd: new Array(),

        action: function (hand)
        {
            if (!pinchGesture.gestureTimer)
            {
                pinchGesture.gestureTimer = new GestureTimer();
            }

            var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);
            var thumbTipVector = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);

            var pinchDistance = pinchGesture.options.distance;

            // Scale distance between thumb and index
            if (pinchGesture.options.scaleWithScene)
            {
                pinchDistance = pinchDistance * transformPlugin.getScale().x;
            }

            // Checks if the distance between the thumb and index meets the minimum requirement for the gesture.
            if (mathHelper.DistanceBetweenPoints(indexTipVector, thumbTipVector) < pinchDistance)
            {
                // Fires the onBeginGesture registered events
                if (!pinchGesture.gestureHasBegun)
                {
                    pinchGesture.gestureHasBegun = true;

                    if (pinchGesture.onGestureBegin && pinchGesture.onGestureBegin.length > 0)
                    {
                        for (var i = 0; i < pinchGesture.onGestureBegin.length; i++)
                        {
                            if (pinchGesture.onGestureBegin[i] && typeof pinchGesture.onGestureBegin[i] === "function")
                            {
                                pinchGesture.onGestureBegin[i](hand);
                            }
                        }
                    }
                }

                // After the time constraint has been satisfied for the full gesture, the registered full gesture functions are fired.
                if (pinchGesture.gestureTimer.timeGesture(pinchGesture.options.delay))
                {
                    pinchGesture.fullGestureAchieved = true;

                    for (var i = 0; i < pinchGesture.onFullGesture.length; i++)
                    {
                        if (pinchGesture.onFullGesture[i] && typeof pinchGesture.onFullGesture[i] === "function")
                        {
                            pinchGesture.onFullGesture[i](hand);
                        }
                    }
                }
            }
            else
            {
                pinchGesture.gestureTimer.resetTimer();

                if (pinchGesture.gestureHasBegun)
                {
                    if (pinchGesture.fullGestureAchieved)
                    {
                        // Once the gesture has been ceased, if full gesture was achieved, the registered onFullGestureEnd functions are called.
                        for (var i = 0; i < pinchGesture.onFullGestureEnd.length; i++)
                        {
                            if (pinchGesture.onFullGestureEnd[i] && typeof pinchGesture.onFullGestureEnd[i] === "function")
                            {
                                pinchGesture.onFullGestureEnd[i](hand);
                            }
                        }
                    }

                    // Once the gesture has been ceased, the registered onEndGesture functions are called.
                    for (var i = 0; i < pinchGesture.onGestureEnd.length; i++)
                    {
                        if (pinchGesture.onGestureEnd[i] && typeof pinchGesture.onGestureEnd[i] === "function")
                        {
                            pinchGesture.onGestureEnd[i](hand);
                        }
                    }
                }


                pinchGesture.gestureHasBegun = false;
                pinchGesture.fullGestureAchieved = false;
            }
        },

        registerOnGestureBegin: function (func)
        {
            pinchGesture.onGestureBegin.push(func);
        },

        registerOnFullGesture: function (func)
        {
            pinchGesture.onFullGesture.push(func);
        },

        registerOnFullGestureEnd: function (func)
        {
            pinchGesture.onFullGestureEnd.push(func);
        },

        registerOnGestureEnd: function (func)
        {
            pinchGesture.onGestureEnd.push(func);
        }
    }