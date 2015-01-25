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
            distance: 80,

            // Minimum time of gesture for full gesture to be achieved
            delay: 0.3,

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

            //if (!)

            // Checks if the distance between the thumb and index meets the minimum requirement for the gesture.
            if (hand.pinchStrength > 0.3 && indexTipVector.distanceTo(thumbTipVector) < pinchDistance)
            {
                //console.log("James distance: " + mathHelper.DistanceBetweenPoints(indexTipVector, thumbTipVector));
                //console.log("ThreeJS distance" + indexTipVector.distanceTo(thumbTipVector));

                // Fires the onBeginGesture registered events
                if (!pinchGesture.gestureHasBegun)
                {
                    pinchGesture.gestureHasBegun = true;

                    if (pinchGesture.onGestureBegin && pinchGesture.onGestureBegin.length > 0)
                    {
                        for (var i = 0; i < pinchGesture.onGestureBegin.length; i++)
                        {
                            if (pinchGesture.onGestureBegin[i] && pinchGesture.onGestureBegin[i].condition && typeof pinchGesture.onGestureBegin[i].condition === "function")
                            {
                                if (pinchGesture.onGestureBegin[i].condition())
                                {
                                    if (pinchGesture.onGestureBegin[i].func && typeof pinchGesture.onGestureBegin[i].func === "function")
                                    {
                                        pinchGesture.onGestureBegin[i].func(hand);

                                    }
                                }
                            }
                            else
                            {
                                if (pinchGesture.onGestureBegin[i].func && typeof pinchGesture.onGestureBegin[i].func === "function")
                                {
                                    pinchGesture.onGestureBegin[i].func(hand);

                                }
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
                        if (pinchGesture.onFullGesture[i] && pinchGesture.onFullGesture[i].condition && typeof pinchGesture.onFullGesture[i].condition === "function")
                        {
                            if (pinchGesture.onFullGesture[i].condition())
                            {
                                if (pinchGesture.onFullGesture[i].func && typeof pinchGesture.onFullGesture[i].func === "function")
                                {
                                    pinchGesture.onFullGesture[i].func(hand);
                                }
                            }
                        }
                        else
                        {
                            if (pinchGesture.onFullGesture[i].func && typeof pinchGesture.onFullGesture[i].func === "function")
                            {
                                pinchGesture.onFullGesture[i].func(hand);
                            }
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
                            if (pinchGesture.onFullGestureEnd[i] && pinchGesture.onFullGestureEnd[i].condition && typeof pinchGesture.onFullGestureEnd[i].condition === "function")
                            {
                                if (pinchGesture.onFullGestureEnd[i].condition())
                                {
                                    if (pinchGesture.onFullGestureEnd[i].func && typeof pinchGesture.onFullGestureEnd[i].func === "function")
                                    {
                                        pinchGesture.onFullGestureEnd[i].func(hand);
                                    }
                                }
                            }
                            else
                            {
                                if (pinchGesture.onFullGestureEnd[i].func && typeof pinchGesture.onFullGestureEnd[i].func === "function")
                                {
                                    pinchGesture.onFullGestureEnd[i].func(hand);
                                }
                            }
                        }
                    }

                    // Once the gesture has been ceased, the registered onEndGesture functions are called.
                    for (var i = 0; i < pinchGesture.onGestureEnd.length; i++)
                    {
                        if (pinchGesture.onGestureEnd[i] && pinchGesture.onGestureEnd[i].condition && typeof pinchGesture.onGestureEnd[i].condition === "function")
                        {
                            if (pinchGesture.onGestureEnd[i].condition())
                            {
                                if (pinchGesture.onGestureEnd[i].func && typeof pinchGesture.onGestureEnd[i].func === "function")
                                {
                                    pinchGesture.onGestureEnd[i].func(hand);
                                }
                            }
                        }
                        else
                        {
                            if (pinchGesture.onGestureEnd[i].func && typeof pinchGesture.onGestureEnd[i].func === "function")
                            {
                                pinchGesture.onGestureEnd[i].func(hand);
                            }
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