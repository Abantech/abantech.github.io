'use strict'

define(function () {

    function GetAngleBetweenVectors(vector1, vector2)
    {
        var a = {
            x: vector1[0],
            y: vector1[1],
            z: vector1[2]
        }

        var b = {
            x: vector2[0],
            y: vector2[1],
            z: vector2[2]
        }

        var axb = a.x * b.x + a.y * b.y + a.z * b.z;
        var vector1Length = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
        var vector2Length = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);

        return Math.acos(axb / (vector1Length * vector2Length)) * (180 / Math.PI)
    }

    function DistanceBetweenTwoPoints(point1, point2) {
        if (!Array.isArray(point1)) {
            point1 = [point1]
        }

        if (!Array.isArray(point2)) {
            point2 = [point2]
        }

        var a = {
            x: point1[0],
            y: point1[1] || 0,
            z: point1[2] || 0
        }

        var b = {
            x: point2[0],
            y: point2[1] || 0,
            z: point2[2] || 0
        }

        return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y) + (b.z - a.z) * (b.z - a.z))
    }

    function MidpointBetweenTwoPoints(point1, point2) {
        var a = {
            x: point1[0],
            y: point1[1] || 0,
            z: point1[2] || 0
        }

        var b = {
            x: point2[0],
            y: point2[1],
            z: point2[2] || 0
        }

        return [(b.x - a.x) / 2, (b.y - a.y) / 2, (b.z - a.z) / 2];
    }

    function Velocity(point1, point2, time) {
        return (DistanceBetweenTwoPoints(point1, point2) / (time / 1000));
    }

    return {
        GetAngleBetweenVectors: GetAngleBetweenVectors,
        DistanceBetweenTwoPoints: DistanceBetweenTwoPoints,
        MidpointBetweenTwoPoints: MidpointBetweenTwoPoints,
        Velocity: Velocity
    }
})