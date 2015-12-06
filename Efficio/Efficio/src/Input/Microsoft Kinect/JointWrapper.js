define(['Helpers/Math'], function (math) {

// Reference https://msdn.microsoft.com/en-us/library/microsoft.kinect.jointtype.aspx for joint numbering
// Joints are entered into the array based on numerical order

var joints = ["SpineBase", "SpineMid", "Neck", "Head", "ShoulderLeft", "ElbowLeft", "WristLeft", "HandLeft", "ShoulderRight", "ElbowRight", "WristRight", "HandRight", "HipLeft", "KneeLeft", "AnkleLeft", "FootLeft", "HipRight", "KneeRight", "AnkleRight", "FootRight", "SpineShoulder", "HandTipLeft", "ThumbLeft", "HandTipRight", "ThumbRight"];
var jointTrackingStatus = ["NotTracked", "Inferred", "Tracked"];

var acceptableDistanceMinimum = 0.35;
var acceptableDistanceMaximum = 0.6;

    function JointWrapper(RawJoint) {

        // keep the raw joint
        this.RawJoint = RawJoint;

        // 
        this.JointName = joints[RawJoint.JointType];
        this.IsTracked = jointTrackingStatus[RawJoint.TrackingState] == "Tracked";
        this.X = RawJoint.Position.X;
        this.Y = RawJoint.Position.Y;
        this.Z = RawJoint.Position.Z;

        // add the extension functions
        this.IsRightOf = IsRightOf;
        this.IsLeftOf = IsLeftOf;
        this.IsAboveOf = IsAboveOf;
        this.IsBelowOf = IsBelowOf;
        this.IsForwardOf = IsForwardOf;
        this.IsBehindOf = IsBehindOf;
    }

    function GetPosition(joint) {
        var position = [];
        position.push(joint.X);
        position.push(joint.Y);
        position.push(joint.Z);
        return position;
    }

    // Note: Supposed to decide whether the joints are close/far enough apart that we care about the postion
    function IsAcceptableDistance(joint1, joint2) {
        var distance = math.DistanceBetweenTwoPoints(GetPosition(joint1), GetPosition(joint2));
        return distance > acceptableDistanceMinimum && distance < acceptableDistanceMaximum;
    }

    // is this joint right of the passed in joint? The rest are the same
    function IsRightOf(joint) {
        if (IsAcceptableDistance(this,joint)) {
            return false;
        }
        else {
            return this.X > joint.X;
        }       
    }

    function IsLeftOf(joint) {
        if (IsAcceptableDistance(this, joint)) {
            return false;
        }
        else {
            return this.X < joint.X;
        }
    }

    function IsAboveOf(joint) {
        if (IsAcceptableDistance(this, joint)) {
            return false;
        }
        else {
            return this.Y > joint.Y;
        }
    }

    function IsBelowOf(joint) {
        if (IsAcceptableDistance(this, joint)) {
            return false;
        }
        else {
            return this.Y < joint.Y;
        }
    }

    function IsForwardOf(joint) {
        if (IsAcceptableDistance(this, joint)) {
            return false;
        }
        else {
            return this.Z < joint.Z;
        }
    }

    function IsBehindOf(joint) {
        if (IsAcceptableDistance(this, joint)) {
            return false;
        }
        else {
            return this.Z > joint.Z;
        }
    }

    return {
        SpecialJoint: JointWrapper

    }
})