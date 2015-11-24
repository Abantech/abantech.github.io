define(function () {

    function GetAngleBetweenVectors(vector1, vector2)
    {
        a = {
            x: vector1[0],
            y: vector1[1],
            z: vector1[2]
        }

        b = {
            x: vector2[0],
            y: hand.arm.direction()[1],
            z: hand.arm.direction()[2]
        }
        var axb = vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2];
        var vector1Length = Math.sqrt(vector1[0] * vector1[0] + vector1[1] * vector1[1] + vector1[2] * vector1[2]);
        var vector2Length = Math.sqrt(vector2[0] * vector2[0] + vector2[1] * vector2[1] + vector2[2] * vector2[2]);

        return Math.acos(axb / (vector1Length * vector2Length)) * (180 / Math.PI)
    }

    function DistanceBetweenTwoPoints(point1, point2) {
        point1[2] = point1[2] || 0;
        point2[2] = point2[2] || 0;

        return Math.sqrt((point2[0] - point1[0]) * (point2[0] - point1[0]) + (point2[1] - point1[1]) * (point2[1] - point1[1]) + (point2[2] - point1[2]) * (point2[2] - point1[2]))
    }

    function MidpointBetweenTwoPoints(point1, point2) {
        point1[2] = point1[2] || 0;
        point2[2] = point2[2] || 0;

        return [(point2[0] - point1[0]) / 2, (point2[1] - point1[1]) / 2, (point2[2] - point1[2]) / 2];
    }

    function Velocity(point1, point2, time) {
        return (DistanceBetweenTwoPoints(point1, point2) / (time / 1000)) + ' mm/sec' ;
    }

    return {
        GetAngleBetweenVectors: GetAngleBetweenVectors,
        DistanceBetweenTwoPoints: DistanceBetweenTwoPoints,
        MidpointBetweenTwoPoints: MidpointBetweenTwoPoints,
        Velocity: Velocity
    }
})