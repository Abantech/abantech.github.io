
function MovableDirectionalLight() {
    this.light = new THREE.DirectionalLight(0xffffff, 0.5);
    this.light.position.set(-200, 200, 200);

    var d = 200;
    this.light.shadowCameraLeft = -d;
    this.light.shadowCameraRight = d;
    this.light.shadowCameraTop = d;
    this.light.shadowCameraBottom = -d;

    this.light.shadowCameraNear = 200;
    this.light.shadowCameraFar = 500;

    // can help stop appearance of gridlines in objects with opacity < 1
    this.light.shadowBias = -0.0002; // default 0 ~ distance fron corners?
    this.light.shadowDarkness = 0.3; // default 0.5
    this.light.shadowMapWidth = 2048;  // default 512
    this.light.shadowMapHeight = 2048;

    this.light.castShadow = true;
    //		light.shadowCameraVisible = true;
    //    scene.add(this.light);

    this.updateLightPosition = function (lat, lon) {
        var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
        var d2r = pi / 180, r2d = 180 / pi;  // degrees / radians
        function cos(a) { return Math.cos(a); }
        function sin(a) { return Math.sin(a); }
        var theta = lat * d2r;
        var phi = lon * d2r;
        var radius = 600;
        this.light.position.x = radius * cos(theta) * sin(phi);
        this.light.position.y = radius * sin(theta);
        this.light.position.z = radius * cos(theta) * cos(phi);
    }
}