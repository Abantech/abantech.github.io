function GestureTimer()
{
    var clock

    this.timeGesture = function (gestureTime)
    {
        if (!clock)
        {
            clock = new THREE.Clock(true);
            clock.start();
        }
        else
        {
            if (clock.getElapsedTime() > gestureTime)
            {
                clock = null;
                return true;
            }
        }

        return false;
    }

    this.resetTimer = function ()
    {
        this.clock = null;
    }
}