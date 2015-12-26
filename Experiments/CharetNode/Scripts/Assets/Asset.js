THREE.Object3D.prototype.AddHandlesToAsset = function ()
{
    this.geometry.computeBoundingBox();

    var boundingbox = this.geometry.boundingBox;
    var min = boundingbox.min;
    var max = boundingbox.max;

    xLength = boundingbox.max.x - boundingbox.min.x;
    yLength = boundingbox.max.y - boundingbox.min.y;
    zLength = boundingbox.max.z - boundingbox.min.z;


    var arrows = new THREE.Object3D();
    arrows.name = "Arrows";

    var xArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 15 + xLength * this.scale.x / 2, 0xff0000);
    xArrow.name = "XArrow";
    xArrow.userData.isArrow = true;

    var yArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 15 + yLength * this.scale.y / 2, 0x0000ff);
    yArrow.name = "YArrow";
    yArrow.userData.isArrow = true;

    var zArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 15 + zLength * this.scale.z / 2, 0x00ff00);
    zArrow.name = "ZArrow";
    zArrow.userData.isArrow = true;

    arrows.add(xArrow);
    arrows.add(yArrow);
    arrows.add(zArrow);

    arrows.scale.set(1 / this.scale.x, 1 / this.scale.y, 1 / this.scale.z);
    arrows.isArrows = true;

    this.add(arrows);
}

THREE.Object3D.prototype.RemoveHandlesFromAsset = function()
{
    this.remove(this.getObjectByName("Arrows"));
}

THREE.Object3D.prototype.ChangeAssetColorSelected = function()
{
    var HSL = this.material.color.getHSL();
    this.material.color.setHSL(HSL.h, HSL.s, HSL.l + .2);
}

THREE.Object3D.prototype.ChangeAssetColorDeselected = function()
{
    var HSL = this.material.color.getHSL();
    this.material.color.setHSL(HSL.h, HSL.s, HSL.l - .2);
}