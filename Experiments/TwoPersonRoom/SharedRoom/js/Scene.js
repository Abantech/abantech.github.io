
var sceneArea = 200;

function CreateScene() {
    scene = new THREE.Scene();
    CreateRenderer();

    CreateSkybox();
    CreateSceneLighting();
    animate();
}

function CreateRenderer() {
    renderer = new THREE.WebGLRenderer({
        alpha: 1,
        antialias: false
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = 0;
    renderer.domElement.style.left = 0;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.shadowMapEnabled = true;

    document.body.appendChild(renderer.domElement);
}

function CreateSkybox() {
    var files = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"]
    var materials = [];
    for (var i = 0, image; i < 6; i++) {
        image = THREE.ImageUtils.loadTexture('Images/skyboxes/dawnmountains/dawnmountain-' + files[i] + '.png');
        materials.push(new THREE.MeshBasicMaterial({ map: image, side: THREE.BackSide }));
    }

    var skyBox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), new THREE.MeshFaceMaterial(materials));
    skyBox.position.set(0, 100, 0)
    scene.add(skyBox);
}

function CreateGroundPlane() {

    var geometry = new THREE.BoxGeometry(800, 5, 800);
    var material = new THREE.MeshPhongMaterial({
        color: 0x008080,
        ambient: 0x008080,
        specular: 0xee3344,
        shininess: 10,
        side: THREE.DoubleSide
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -50.1, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    window.scene.add(mesh);


    var boxHelper = new THREE.BoxHelper(mesh);
    boxHelper.material.color.setRGB(1, 0, 1);
    scene.add(boxHelper);
}

function CreateSceneLighting() {
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100, 200, 100);
    scene.add(light);

    var light = new THREE.PointLight(0xffffff);
    light.position.set(100, 200, -100);
    scene.add(light);

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
}

function AddCamera(first) {
    if (first) {
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, sceneArea / 100, sceneArea * 4);
        camera.position.z = 75;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    else {
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, sceneArea / 100, sceneArea * 4);
        camera.position.z = -75;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) 
        controls = new THREE.DeviceOrientationControls(camera);
    
}

function animate(timestamp) {
    if (controls) {
            controls.update();
    }

    if (camera) {
        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);

}