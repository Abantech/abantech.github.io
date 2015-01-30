function PinchGesture()
{
    this.options =
    {
        // Minimum distance between the two fingers to determine if pinch has been achieved
        distance: 80,

        // Minimum time of gesture for full gesture to be achieved
        delay: 0.3,

        // Indicates whether or not to scale the gesture distance with the zoom of the camera
        scaleWithScene: true,

        // Indicates which hand the pinch gesture applies to
        type: "right"
    };

    this.singleHandGesture = new SingleHandGesture();
    this.singleHandGesture.gestureOptions.delay = this.options.delay;
    this.singleHandGesture.gestureOptions.type = this.options.type;
    this.singleHandGesture.gestureAction = function(hand)
    {
        var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);
        var thumbTipVector = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);

        var pinchDistance = this.addtionalOptions.distance;

        // Scale distance between thumb and index
        if (this.addtionalOptions.scaleWithScene)
        {
            pinchDistance = pinchDistance * transformPlugin.getScale().x;
        }

        // Checks if the distance between the thumb and index meets the minimum requirement for the gesture.
        return hand.pinchStrength > 0.3 && indexTipVector.distanceTo(thumbTipVector) < pinchDistance;
    }

    this.singleHandGesture.addtionalOptions = {
        scaleWithScene: this.options.scaleWithScene,
        distance: this.options.distance
    }

    this.action = this.singleHandGesture.action;

    // Set Options
    this.setDelay = function (delay)
    {
        this.options.delay = delay;
        this.singleHandGesture.gestureOptions.delay = delay;
    }

    this.setType = function (type)
    {
        this.options.type = type;
        this.singleHandGesture.gestureOptions.type = type;
    }

    // Set Addtional Options
    this.setDistance = function (distance)
    {
        this.options.distance = distance;
        this.singleHandGesture.addtionalOptions.distance = distance
    }

    this.setScaleWithScene = function (scaleWithScene)
    {
        this.options.scaleWithScene = scaleWithScene;
        this.singleHandGesture.addtionalOptions.scaleWithScene = scaleWithScene
    }

    // Code to register actions on the gesture
    this.registerOnGestureBegin = function (func)
    {
        this.singleHandGesture.registerOnGestureBegin(func);
    };

    this.registerOnFullGesture = function (func)
    {
        this.singleHandGesture.registerOnFullGesture(func);
    };

    this.registerOnFullGestureEnd = function (func)
    {
        this.singleHandGesture.registerOnFullGestureEnd(func);
    };

    this.registerOnGestureEnd = function (func)
    {
        this.singleHandGesture.registerOnGestureEnd(func);
    };
}

var rightHandPinchGesture = new PinchGesture();

var leftHandPinchGesture = new PinchGesture();
leftHandPinchGesture.setType("left");

var eitherHandPinchGesutre = new PinchGesture();
eitherHandPinchGesutre.setType("either");
