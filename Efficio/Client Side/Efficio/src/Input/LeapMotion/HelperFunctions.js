define([], function () {

    function NormalizePoint(frame, point) {
        return frame.interactionBox.normalizePoint(point, true);
    }

    function MapPointToAppCoordinates(frame, point, minimums, maximums) {
        return MapNormalizedPointToAppCoordinates(NormalizePoint(frame, point), minimums, maximums);
    }

    function MapNormalizedPointToAppCoordinates(point, minimums, maximums) {
        minX = minimums[0];
        minY = minimums[1];
        minZ = minimums[2];
        maxX = maximums[0];
        maxY = maximums[1];
        maxZ = maximums[2];

        return [
            GetIntermeditatePoint(minX, maxX, point[0]),
            GetIntermeditatePoint(minY, maxY, point[1]),
            GetIntermeditatePoint(minZ, maxZ, point[2]),
        ]
    }

    function GetIntermeditatePoint(min, max, percent) {
        return min + ((max - min) * percent);
    }

    return {
        NormalizePoint: NormalizePoint,
        MapPointToAppCoordinates: MapPointToAppCoordinates,
        MapNormalizedPointToAppCoordinates: MapNormalizedPointToAppCoordinates
    }
})