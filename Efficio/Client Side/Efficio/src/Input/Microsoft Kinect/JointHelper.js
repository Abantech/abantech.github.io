define(function () {

    // Reference https://msdn.microsoft.com/en-us/library/microsoft.kinect.jointtype.aspx for joint numbering
    // Joints are entered into the array based on numerical order

    var joints = ["SpineBase", "SpineMid", "Neck", "Head", "ShoulderLeft", "ElbowLeft", "WristLeft", "HandLeft", "ShoulderRight", "ElbowRight", "WristRight", "HandRight", "HipLeft", "KneeLeft", "AnkleLeft", "FootLeft", "HipRight", "KneeRight", "AnkleRight", "FootRight", "SpineShoulder", "HandTipLeft", "ThumbLeft", "HandTipRight", "ThumbRight"];

    function GetJointName(jointNumber) {
        return joints[jointNumber];
    }

    var jointTrackingStatus = ["NotTracked", "Inferred", "Tracked"];

    function GetJointTrackingStatus(trackNumber) {
        return jointTrackingStatus[trackNumber];
    }

    return {
        GetJointName: GetJointName ,

        GetJointTrackingStatus:GetJointTrackingStatus
    }
})
