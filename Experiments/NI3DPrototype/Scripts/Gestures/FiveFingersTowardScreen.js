﻿function FiveFingersTowardScreenGesture()
{
    this.gestureTimer;

    // Tracks wether or not the gesture has already begun.  Used to signal the 'onBeginGesture' to fire.
    this.gestureHasBegun = false;

    // Tracks wether or not the full gesture (gesture performed for longer than the delay period) was achieved.
    // Passed to the onEndGesture event.
    this.fullGestureAchieved = false;

    this.options =
    {
        sensitivity: .7,

        // Minimum time of gesture for full gesture to be achieved
        delay: 0.5,

        // Indicates which hand the pinch gesture applies to
        type: "right"
    };

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
        if (!this.gestureTimer)
        {
            this.gestureTimer = new GestureTimer();
        }

        if (this.options.type != "either")
        {
            if (hand.type != this.options.type)
            {
                return;
            }
        }

        var finger0 = hand.fingers[0];
        var finger1 = hand.fingers[1];
        var finger2 = hand.fingers[2];
        var finger3 = hand.fingers[3];
        var finger4 = hand.fingers[4];

        //if (!)

        // Checks if the distance between the thumb and index meets the minimum requirement for the gesture.
        if (finger0.direction[2] < -this.options.sensitivity && finger0.direction[2] < -this.options.sensitivity && finger0.direction[2] < -this.options.sensitivity && finger0.direction[2] < -this.options.sensitivity && finger0.direction[2] < -this.options.sensitivity)
        {
            //console.log("James distance: " + mathHelper.DistanceBetweenPoints(indexTipVector, thumbTipVector));
            //console.log("ThreeJS distance" + indexTipVector.distanceTo(thumbTipVector));

            // Fires the onBeginGesture registered events
            if (!this.gestureHasBegun)
            {
                this.gestureHasBegun = true;

                if (this.onGestureBegin && this.onGestureBegin.length > 0)
                {
                    for (var i = 0; i < this.onGestureBegin.length; i++)
                    {
                        if (this.onGestureBegin[i] && this.onGestureBegin[i].condition && typeof this.onGestureBegin[i].condition === "function")
                        {
                            if (this.onGestureBegin[i].condition())
                            {
                                if (this.onGestureBegin[i].func && typeof this.onGestureBegin[i].func === "function")
                                {
                                    this.onGestureBegin[i].func(hand);

                                }
                            }
                        }
                        else
                        {
                            if (this.onGestureBegin[i].func && typeof this.onGestureBegin[i].func === "function")
                            {
                                this.onGestureBegin[i].func(hand);

                            }
                        }
                    }
                }
            }

            // After the time constraint has been satisfied for the full gesture, the registered full gesture functions are fired.
            if (this.fullGestureAchieved || this.gestureTimer.timeGesture(this.options.delay))
            {
                this.fullGestureAchieved = true;

                for (var i = 0; i < this.onFullGesture.length; i++)
                {
                    if (this.onFullGesture[i] && this.onFullGesture[i].condition && typeof this.onFullGesture[i].condition === "function")
                    {
                        if (this.onFullGesture[i].condition())
                        {
                            if (this.onFullGesture[i].func && typeof this.onFullGesture[i].func === "function")
                            {
                                this.onFullGesture[i].func(hand);
                            }
                        }
                    }
                    else
                    {
                        if (this.onFullGesture[i].func && typeof this.onFullGesture[i].func === "function")
                        {
                            this.onFullGesture[i].func(hand);
                        }
                    }
                }
            }
        }
        else
        {
            this.gestureTimer.resetTimer();

            if (this.gestureHasBegun)
            {
                if (this.fullGestureAchieved)
                {
                    // Once the gesture has been ceased, if full gesture was achieved, the registered onFullGestureEnd functions are called.
                    for (var i = 0; i < this.onFullGestureEnd.length; i++)
                    {
                        if (this.onFullGestureEnd[i] && this.onFullGestureEnd[i].condition && typeof this.onFullGestureEnd[i].condition === "function")
                        {
                            if (this.onFullGestureEnd[i].condition())
                            {
                                if (this.onFullGestureEnd[i].func && typeof this.onFullGestureEnd[i].func === "function")
                                {
                                    this.onFullGestureEnd[i].func(hand);
                                }
                            }
                        }
                        else
                        {
                            if (this.onFullGestureEnd[i].func && typeof this.onFullGestureEnd[i].func === "function")
                            {
                                this.onFullGestureEnd[i].func(hand);
                            }
                        }
                    }
                }

                // Once the gesture has been ceased, the registered onEndGesture functions are called.
                for (var i = 0; i < this.onGestureEnd.length; i++)
                {
                    if (this.onGestureEnd[i] && this.onGestureEnd[i].condition && typeof this.onGestureEnd[i].condition === "function")
                    {
                        if (this.onGestureEnd[i].condition())
                        {
                            if (this.onGestureEnd[i].func && typeof this.onGestureEnd[i].func === "function")
                            {
                                this.onGestureEnd[i].func(hand);
                            }
                        }
                    }
                    else
                    {
                        if (this.onGestureEnd[i].func && typeof this.onGestureEnd[i].func === "function")
                        {
                            this.onGestureEnd[i].func(hand);
                        }
                    }
                }
            }

            this.gestureHasBegun = false;
            this.fullGestureAchieved = false;
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

var rightHandFiveFingersTowardScreenGesture = new FiveFingersTowardScreenGesture();

var leftHandFiveFingersTowardScreenGesture = new FiveFingersTowardScreenGesture();
leftHandFiveFingersTowardScreenGesture.options.type = "left";

var eitherHandFiveFingersTowardScreenGesture = new FiveFingersTowardScreenGesture();
eitherHandFiveFingersTowardScreenGesture.options.type = "either";