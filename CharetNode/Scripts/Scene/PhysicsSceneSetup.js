var isPhysicsEnabled = true;

var scene = new Physijs.Scene({ reportsize: 50, fixedTimeStep: 1 / 180 });   // defaults
scene.setGravity(new THREE.Vector3(0, -30.0, 0));
scene.addEventListener('update', function () {
    scene.simulate(undefined, 1);
});

var friction = .8; // high friction
var restitution = .3; // low restitution
table_material = Physijs.createMaterial(

    new THREE.MeshLambertMaterial({ color: 0x008080, ambient: 0x008080 }),
    friction,
    restitution
);

var sceneArea = 200;
var sceneLights;

var initScene = function () {
    window.scene = scene;
    window.renderer = new THREE.WebGLRenderer({
        alpha: 1,
        antialias: false
    });

    window.renderer.setClearColor(0x000000, 0);
    window.renderer.setSize(window.innerWidth, window.innerHeight);

    window.renderer.domElement.style.position = 'fixed';
    window.renderer.domElement.style.top = 0;
    window.renderer.domElement.style.left = 0;
    window.renderer.domElement.style.width = '100%';
    window.renderer.domElement.style.height = '100%';
    renderer.shadowMapEnabled = true;

    document.body.appendChild(window.renderer.domElement);

    window.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, sceneArea / 100, sceneArea * 4);
    window.camera.position.z = sceneArea;
    window.camera.lookAt(new THREE.Vector3(0, 0, 0));

    controls = new THREE.OrbitControls(window.camera);
    controls.damping = 0.2;
    controls.addEventListener('change', renderer.render);

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);

    scene.add(camera);
    //   renderer.render(scene, camera);

};

var createGroundPlane = function () {

    var geometry = new THREE.BoxGeometry(800, 5, 800);
    var material = new THREE.MeshPhongMaterial({
        color: 0x008080,
        ambient: 0x008080,
        specular: 0xee3344,
        shininess: 50,
        side: THREE.DoubleSide
    });

    var table = new Physijs.BoxMesh(
			new THREE.BoxGeometry(600, 5, 300),
			table_material,
			0, // mass
			{ friction: friction, restitution: restitution }
        );

    //table = new THREE.Mesh(geometry, material);
    table.position.set(0, -50.1, 0);
    table.castShadow = true;
    table.receiveShadow = true;
    window.scene.add(table);


    var boxHelper = new THREE.BoxHelper(table);
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

var createBackgroundGradient = function () {

    var col1 = "#2e3138";
    var col2 = "#2e3138";
    var col3 = "#2e3138";
    var X = (Math.random() * window.innerWidth).toFixed(0);
    var Y = (Math.random() * window.innerHeight).toFixed(0);
    var center = 20 + (Math.random() * 60).toFixed(0);

    var cssBackround = document.body.appendChild(document.createElement('style'));
    cssBackround.innerText = 'body { ' +
        'background: -webkit-radial-gradient(' + X + 'px ' + Y + 'px, farthest-corner, ' + col1 + ' 0%, ' + col2 + ' 50%, ' + col3 + ' 100%); ' +
        'background: -moz-radial-gradient(' + X + 'px ' + Y + 'px, farthest-corner, ' + col1 + ' 0%, ' + col2 + ' 50%, ' + col3 + ' 100%); ' +
        'background: radial-gradient(' + X + 'px ' + Y + 'px, farthest-corner, ' + col1 + ' 0%, ' + col2 + ' 50%, ' + col3 + ' 100%); }' +
    '';

}

initScene();
createSceneLighting();
createGroundPlane();
createBackgroundGradient();
animate();


function animate(timestamp) {
    renderer.render(scene, camera);
    controls.update();
    //		stats.update();
    requestAnimationFrame(animate);

}
