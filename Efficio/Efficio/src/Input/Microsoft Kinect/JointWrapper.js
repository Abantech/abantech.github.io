define(['Helpers/Math'], function (math) {

// Reference https://msdn.microsoft.com/en-us/library/microsoft.kinect.jointtype.aspx for joint numbering
// Joints are entered into the array based on numerical order

var joints = ["SpineBase", "SpineMid", "Neck", "Head", "ShoulderLeft", "ElbowLeft", "WristLeft", "HandLeft", "ShoulderRight", "ElbowRight", "WristRight", "HandRight", "HipLeft", "KneeLeft", "AnkleLeft", "FootLeft", "HipRight", "KneeRight", "AnkleRight", "FootRight", "SpineShoulder", "HandTipLeft", "ThumbLeft", "HandTipRight", "ThumbRight"];
var jointTrackingStatus = ["NotTracked", "Inferred", "Tracked"];

var acceptableDistanceMinimum = 0.2;
var acceptableDistanceMaximum = 0.3;

    function JointWrapper(RawJoint) {

        // keep the raw joint
        this.RawJoint = RawJoint;

        // 
        this.JointName = joints[RawJoint.JointType];
        this.IsTracked = jointTrackingStatus[RawJoint.TrackingState] == "Tracked";
        this.X = RawJoint.Position.X;
        this.Y = RawJoint.Position.Y;
        this.Z = RawJoint.Position.Z;

        // stored for convenience
        this.AbsoluteX = Math.abs(this.X);
        this.AbsoluteY = Math.abs(this.Y);
        this.AbsoluteZ = Math.abs(this.Z);

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
        var distance = math.DistanceBetweenTwoPositions(GetPosition(joint1), GetPosition(joint2));
        return distance > acceptableDistanceMinimum && distance < acceptableDistanceMaximum;
    }

    function IsAcceptableDistance2(position1, position2) {
        // could pass in 2 x's, y's, or z's
        var distance = DistanceBetweenTwoPositions(position1, position2);
        return (distance > acceptableDistanceMinimum) && (distance < acceptableDistanceMaximum);
    }

    function DistanceBetweenTwoPositions(position1, position2) {
        return Math.abs(position1 - position2);
    }


    // is this joint right of the passed in joint? The rest are the same
    function IsRightOf(joint) {
        if ((this.X - joint.X) > acceptableDistanceMinimum)
        {
            return true;
        }
        else {
            return false;
        }      
    }

    function IsLeftOf(joint) {
        if ((joint.X - this.X) > acceptableDistanceMinimum) {
            return true;
        }
        else {
            return false;
        }
        //return this.X < joint.X;
    }

    function IsAboveOf(joint) {
        //if (IsAcceptableDistance2(this.Y, joint.Y)) {
        //    console.log("Is Above of Acceptable distance + " + DistanceBetweenTwoPositions(this.Y, joint.Y));
        //    return this.Y > joint.Y;
        //}
        //else {          
        //    return false;
        //}
        return this.Y > joint.Y;
    }

    function IsBelowOf(joint) {
        //if (IsAcceptableDistance2(this.Y, joint.Y)) {
        //    console.log("Is Below of Acceptable distance + " + DistanceBetweenTwoPositions(this.Y, joint.Y));
        //    return this.Y < joint.Y;
        //}
        //else {          
        //    return false;
        //}
        return this.Y < joint.Y;
    }

    function IsForwardOf(joint) {

        if ((joint.Z - this.Z) > acceptableDistanceMinimum) {
            return true;
        }
        else {
            return false;
        }
       // return this.Z < joint.Z;
    }

    function IsBehindOf(joint) {
        if ((this.Z - joint.Z) > acceptableDistanceMinimum) {
            return true;
        }
        else {
            return false;
        }
        //return this.Z > joint.Z;
    }

    return {
        SpecialJoint: JointWrapper

    }
})