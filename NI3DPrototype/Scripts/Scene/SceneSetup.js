var sceneArea = 200;
var sceneLights;

var initScene = function () {
    window.scene = new THREE.Scene();
    window.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false
    });

    window.renderer.setClearColor(0x000000, 0);
    window.renderer.setSize(window.innerWidth, window.innerHeight);

    window.renderer.domElement.style.position = 'fixed';
    window.renderer.domElement.style.top = 0;
    window.renderer.domElement.style.left = 0;
    window.renderer.domElement.style.width = '100%';
    window.renderer.domElement.style.height = '100%';

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
    renderer.render(scene, camera);
};

var createRandomCones = function(coneCount) {
    var geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading });

    for (var i = 0; i < coneCount; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 1000;
        mesh.position.y = (Math.random() - 0.5) * 1000;
        mesh.position.z = (Math.random() - 0.5) * 1000;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        window.scene.add(mesh);
    }
}

var createSceneLighting = function() {
    if (!sceneLights)
        sceneLights = []

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    window.scene.add(light);
    sceneLights.push(light);

    light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    window.scene.add(light);
    sceneLights.push(light);

    light = new THREE.AmbientLight(0x222222);
    window.scene.add(light);
    sceneLights.push(light);
}

initScene();
createSceneLighting();
createRandomCones(30);