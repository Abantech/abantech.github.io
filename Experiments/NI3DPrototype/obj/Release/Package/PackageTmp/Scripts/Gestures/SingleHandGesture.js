function SingleHandGesture()
{
    this.gestureTimer;

    // Tracks wether or not the gesture has already begun.  Used to signal the 'onBeginGesture' to fire.
    this.gestureHasBegun = false;

    // Tracks wether or not the full gesture (gesture performed for longer than the delay period) was achieved.
    // Passed to the onEndGesture event.
    this.fullGestureAchieved = false;

    this.gestureOptions =
    {
        // Minimum time of gesture for full gesture to be achieved
        delay: 0.3,

        // Indicates which hand the pinch gesture applies to
        type: "right"
    };

    this.addtionalOptions;

    this.gestureAction;

    // The collection of functions to be called when the gesture has begun
    this.onGestureBegin = new Array();

    // The collection of functions to be called when the full gesture has begun
    this.onFullGesture = new Array();

    // The collection of functions to be called when the full gesture has ended
    this.onFullGestureEnd = new Array();

    // The collection of functions to be called when the gesture has ended
    this.onGestureEnd = new Array();

    this.action = function (hand)
    {
        if (!this.singleHandGesture.gestureTimer)
        {
            this.singleHandGesture.gestureTimer = new GestureTimer();
        }

        if (this.singleHandGesture.gestureOptions.type != "either")
        {
            if (hand.type != this.singleHandGesture.gestureOptions.type)
            {
                return;
            }
        }

        var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);
        var thumbTipVector = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);

        var pinchDistance = this.singleHandGesture.gestureOptions.distance;

        // Scale distance between thumb and index
        if (this.singleHandGesture.gestureOptions.scaleWithScene)
        {
            pinchDistance = pinchDistance * transformPlugin.getScale().x;
        }

        //if (!)

        // Checks if the distance between the thumb and index meets the minimum requirement for the gesture.
        if (this.singleHandGesture.gestureAction && this.singleHandGesture.gestureAction(hand))
        {
            //console.log("James distance: " + mathHelper.DistanceBetweenPoints(indexTipVector, thumbTipVector));
            //console.log("ThreeJS distance" + indexTipVector.distanceTo(thumbTipVector));

            // Fires the onBeginGesture registered events
            if (!this.singleHandGesture.gestureHasBegun)
            {
                this.singleHandGesture.gestureHasBegun = true;

                if (this.singleHandGesture.onGestureBegin && this.singleHandGesture.onGestureBegin.length > 0)
                {
                    for (var i = 0; i < this.singleHandGesture.onGestureBegin.length; i++)
                    {
                        if (this.singleHandGesture.onGestureBegin[i] && this.singleHandGesture.onGestureBegin[i].condition && typeof this.singleHandGesture.onGestureBegin[i].condition === "function")
                        {
                            if (this.singleHandGesture.onGestureBegin[i].condition())
                            {
                                if (this.singleHandGesture.onGestureBegin[i].func && typeof this.singleHandGesture.onGestureBegin[i].func === "function")
                                {
                                    this.singleHandGesture.onGestureBegin[i].func(hand);

                                }
                            }
                        }
                        else
                        {
                            if (this.singleHandGesture.onGestureBegin[i].func && typeof this.singleHandGesture.onGestureBegin[i].func === "function")
                            {
                                this.singleHandGesture.onGestureBegin[i].func(hand);

                            }
                        }
                    }
                }
            }

            // After the time constraint has been satisfied for the full gesture, the registered full gesture functions are fired.
            if (this.singleHandGesture.fullGestureAchieved || this.singleHandGesture.gestureTimer.timeGesture(this.singleHandGesture.gestureOptions.delay))
            {
                this.singleHandGesture.fullGestureAchieved = true;

                for (var i = 0; i < this.singleHandGesture.onFullGesture.length; i++)
                {
                    if (this.singleHandGesture.onFullGesture[i] && this.singleHandGesture.onFullGesture[i].condition && typeof this.singleHandGesture.onFullGesture[i].condition === "function")
                    {
                        if (this.singleHandGesture.onFullGesture[i].condition())
                        {
                            if (this.singleHandGesture.onFullGesture[i].func && typeof this.singleHandGesture.onFullGesture[i].func === "function")
                            {
                                this.singleHandGesture.onFullGesture[i].func(hand);
                            }
                        }
                    }
                    else
                    {
                        if (this.singleHandGesture.onFullGesture[i].func && typeof this.singleHandGesture.onFullGesture[i].func === "function")
                        {
                            this.singleHandGesture.onFullGesture[i].func(hand);
                        }
                    }
                }
            }
        }
        else
        {
            this.singleHandGesture.gestureTimer.resetTimer();

            if (this.singleHandGesture.gestureHasBegun)
            {
                if (this.singleHandGesture.fullGestureAchieved)
                {
                    // Once the gesture has been ceased, if full gesture was achieved, the registered onFullGestureEnd functions are called.
                    for (var i = 0; i < this.singleHandGesture.onFullGestureEnd.length; i++)
                    {
                        if (this.singleHandGesture.onFullGestureEnd[i] && this.singleHandGesture.onFullGestureEnd[i].condition && typeof this.singleHandGesture.onFullGestureEnd[i].condition === "function")
                        {
                            if (this.singleHandGesture.onFullGestureEnd[i].condition())
                            {
                                if (this.singleHandGesture.onFullGestureEnd[i].func && typeof this.singleHandGesture.onFullGestureEnd[i].func === "function")
                                {
                                    this.singleHandGesture.onFullGestureEnd[i].func(hand);
                                }
                            }
                        }
                        else
                        {
                            if (this.singleHandGesture.onFullGestureEnd[i].func && typeof this.singleHandGesture.onFullGestureEnd[i].func === "function")
                            {
                                this.singleHandGesture.onFullGestureEnd[i].func(hand);
                            }
                        }
                    }
                }

                // Once the gesture has been ceased, the registered onEndGesture functions are called.
                for (var i = 0; i < this.singleHandGesture.onGestureEnd.length; i++)
                {
                    if (this.singleHandGesture.onGestureEnd[i] && this.singleHandGesture.onGestureEnd[i].condition && typeof this.singleHandGesture.onGestureEnd[i].condition === "function")
                    {
                        if (this.singleHandGesture.onGestureEnd[i].condition())
                        {
                            if (this.singleHandGesture.onGestureEnd[i].func && typeof this.singleHandGesture.onGestureEnd[i].func === "function")
                            {
                                this.singleHandGesture.onGestureEnd[i].func(hand);
                            }
                        }
                    }
                    else
                    {
                        if (this.singleHandGesture.onGestureEnd[i].func && typeof this.singleHandGesture.onGestureEnd[i].func === "function")
                        {
                            this.singleHandGesture.onGestureEnd[i].func(hand);
                        }
                    }
                }
            }

            this.singleHandGesture.gestureHasBegun = false;
            this.singleHandGesture.fullGestureAchieved = false;
        }
    },

    this.registerOnGestureBegin = function (func)
    {
        this.onGestureBegin.push(func);
    };

    this.registerOnFullGesture = function (func)
    {
        this.onFullGesture.push(func);
    };

    this.registerOnFullGestureEnd = function (func)
    {
        this.onFullGestureEnd.push(func);
    };

    this.registerOnGestureEnd = function (func)
    {
        this.onGestureEnd.push(func);
    };
}