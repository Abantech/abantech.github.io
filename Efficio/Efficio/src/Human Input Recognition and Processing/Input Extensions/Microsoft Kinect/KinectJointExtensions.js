define(function () {

    function IsAbove(joint1, joint2) {
        var result = DistanceAbove(joint1, joint2);
        return result > 0;
    }

    function IsBelow(joint1, joint2) {
        var result = DistanceBelow(joint1, joint2);
        return result > 0;
    }

    function IsRight(joint1, joint2) {
        var result = DistanceRight(joint1, joint2);
        return result > 0;
    }

    function IsLeft(joint1, joint2) {
        var result = DistanceLeft(joint1, joint2);
        return result > 0;
    }

    function IsForward(joint1, joint2) {
        var result = DistanceForward(joint1, joint2);
        return result > 0;
    }

    function IsBehind(joint1, joint2) {
        var result = DistanceBehind(joint1, joint2);
        return result > 0;
    }

    function DistanceAbove(joint1, joint2) {
        var result = joint2.Position.Y - joint1.Position.Y;
        return result;
    }

    function DistanceBelow(joint1, joint2) {
        var result = joint1.Position.Y - joint2.Position.Y;
        return result;
    }

    function DistanceRight(joint1, joint2) {
        var result = joint2.Position.X - joint1.Position.X;
        return result;
    }

    function DistanceLeft(joint1, joint2) {
        var result = joint1.Position.X - joint2.Position.X;
        return result;
    }

    function DistanceForward(joint1, joint2) {
        var result = joint2.Position.Z - joint1.Position.Z;
        return result;
    }

    function DistanceBehind(joint1, joint2) {
        var result = joint1.Position.Z - joint2.Position.Z;
        return result;
    }

    function ExtendClasses() {
        var extensions = {

            IsAbove: IsAbove,
            IsBelow: IsBelow,
            IsRight: IsRight,
            IsLeft: IsLeft,
            IsForward: IsForward,
            IsBehind: IsBehind,


            DistanceAboce: DistanceAbove,
            DistanceBelow: DistanceBelow,
            DistanceRight: DistanceRight,
            DistanceLeft: DistanceLeft,
            DistanceForward: DistanceForward,
            DistanceBehind: DistanceBehind

        }

        return extensions;
    }

    return {
        ExtendClasses: ExtendClasses
    }
})