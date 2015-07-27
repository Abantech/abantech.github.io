/// <reference path="../../Libs/THREEJS/three.js" />
var sceneArea = 200;
var sceneLights;
var clock = new THREE.Clock();
var updateControls;
var controller, controls, cursor, initScene, stats;

initScene = function (element) {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(innerWidth, innerHeight);
    element.appendChild(renderer.domElement);

    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = 0;
    renderer.domElement.style.left = 0;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.shadowMapEnabled = true;

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, sceneArea / 100, sceneArea * 4);
    camera.position.z = sceneArea;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    if (typeof (useNUIConrols) != 'undefined')
        if (useNUIConrols)
            addFirstPersonControls();

    if (!updateControls)
        addOrbitControls();

    window.addEventListener('resize', function () {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
        renderer.render(scene, camera);
    }, false);

    scene.add(camera);

    window.scene = scene;
    window.renderer = renderer;
    window.camera = camera;
};

var addOrbitControls = function () {
    controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    //   controls.addEventListener('change', renderer.render);
    updateControls = function () { controls.update(); }
}

var addFirstPersonControls = function () {
    controls = new THREE.FirstPersonControls(camera);

    controls.lookSpeed = 0.015; // 0.0125;
    controls.lookSpeedMin = 0.005;
    controls.lookSpeedMax = 0.5;
    controls.movementSpeed = 50;
    controls.movementSpeedMin = 20;
    controls.movementSpeedMax = 300;
    controls.noFly = false;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 1.5;
    controls.verticalMax = 2.0;

    updateControls = function () { controls.update(clock.getDelta()) }
}

var createGroundPlane = function () {

    var geometry = new THREE.BoxGeometry(800, 5, 800);
    var material = new THREE.MeshPhongMaterial({
        color: 0x008080,
        ambient: 0x008080,
        specular: 0xee3344,
        shininess: 50,
        side: THREE.DoubleSide
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -50.1, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    assetManager.CreateAsset("ground", mesh, true);


    var boxHelper = new THREE.BoxHelper(mesh);
    boxHelper.material.color.setRGB(1, 0, 1);
    scene.add(boxHelper);

    var gridHelper = new THREE.GridHelper(400, 10);
    gridHelper.position.set(0, -47.5, 0);
    scene.add(gridHelper);

    var axisHelper = new THREE.AxisHelper(50);
    axisHelper.position.set(0, -47.5, 0);
    scene.add(axisHelper);
}

var createSceneLighting = function () {

    light = new THREE.AmbientLight(0x888888);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-200, 200, 200);

    var d = 200;
    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraNear = 200;
    light.shadowCameraFar = 500;

    // can help stop appearance of gridlines in objects with opacity < 1
    light.shadowBias = -0.0002; // default 0 ~ distance fron corners?
    light.shadowDarkness = 0.3; // default 0.5
    light.shadowMapWidth = 2048;  // default 512
    light.shadowMapHeight = 2048;

    light.castShadow = true;
    //		light.shadowCameraVisible = true;
    scene.add(light);

    light = new THREE.PointLight(0xffffff, 0.5);
    light.position = camera.position;
    camera.add(light);

}

function animate(timestamp) {
    renderer.render(scene, camera);
    updateControls();
    requestAnimationFrame(animate);
}

var webglAvailable = (function () { try { var canvas = document.createElement('canvas'); return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')); } catch (e) { return false; } })();

if (webglAvailable)
{
    var container = document.createElement( 'div' );
    document.body.appendChild( container );

    initScene(container);
    createSceneLighting();

    animate();
}
else {
    alert("WebGL is unavailable")
}

