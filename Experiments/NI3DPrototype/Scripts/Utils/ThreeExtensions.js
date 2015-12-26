(function (clone)
{
    THREE.Mesh.prototype.clone = function (object, recursive)
    {
        var copy = clone.call(this);
        var material = this.material.clone();

        copy.material = material
        return copy;
    };
}(THREE.Mesh.prototype.clone));