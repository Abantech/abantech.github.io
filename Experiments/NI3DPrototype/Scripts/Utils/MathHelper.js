var mathHelper = new MathHelper()

function MathHelper()
{
    this.DistanceBetweenPoints = function(vector1, vector2)
    {
        var dx = vector1.x - vector2.x;
        var dy = vector1.y - vector2.y;
        var dz = vector1.z - vector2.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    this.FindScalar = function(vector1, vector2)
    {
        var center = new THREE.Vector3(0, 0, 0);

        return mathHelper.DistanceBetweenPoints(vector2, center) / mathHelper.DistanceBetweenPoints(vector1, center);
    }
}