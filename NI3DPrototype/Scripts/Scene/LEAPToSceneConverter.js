// This class attaches functions to the transform plugin.

function LEAPToSceneConverter()
{
    // The last position of the camera
    var lastPosition;

    // Rotation, Position, and Scalar changes
    var rotation;
    var scalar;
    var position;

    /* 
    *   Attaches a function that gets the rotation of the camera to the 'quaternion' property of the transform plugin.
    *   This makes the transform plugin's rotation property dynamic whose value is based on the camera's current position.
    */
    this.AttachRotationConverter = function ()
    {
        transformPlugin.quaternion = function ()
        {
            return window.camera.quaternion;
        }
    }

    this.AttachScaleConverter = function ()
    {
        // Finds how much the LeapMotion inputs need to be scaled, based on the distance from the origin (0, 0, 0)
        transformPlugin.scale = function ()
        {
            // Get the current position of the camera
            var currentPosition = new THREE.Vector3(window.camera.position.x, window.camera.position.y, window.camera.position.z);

            // Get the ratio of the difference between the last position and the current position
            var differenceRatio = mathHelper.FindScalar(lastPosition, currentPosition);

            // Change the scalar by the ratio of the different distances
            var newScalar = scalar.x * differenceRatio;

            // Set the scalar to the new value
            scalar.set(newScalar, newScalar, newScalar);

            // Track the new position
            lastPosition = currentPosition;

            return scalar;
        }
    }

    // Initializes the scale variable to the initial scale variable suppied by the 'Transform' plugin
    this.setStartingScale = function ()
    {
        if (typeof transformPlugin.scale.set === "function")
        {
            scalar = transformPlugin.scale;
        }
        else
        {
            scalar = new THREE.Vector3(transformPlugin.scale, transformPlugin.scale, transformPlugin.scale);
        }
    }

    // Sets the starting position of the camera
    this.setStartingPosition = function ()
    {
        lastPosition = new THREE.Vector3(window.camera.position.x, window.camera.position.y, window.camera.position.z);
    }

    this.AttachPositionConverter = function ()
    {

    }

    this.Initialize = function()
    {
        // Initializes the scale variable to the initial scale variable suppied by the 'Transform' plugin
        leapToSceneConverter.setStartingScale();

        // Initializes the lastPosition variable to the initial position of the camera.
        leapToSceneConverter.setStartingPosition();
    }
}

var leapToSceneConverter = new LEAPToSceneConverter();