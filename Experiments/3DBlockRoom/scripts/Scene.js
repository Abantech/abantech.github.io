var scene = new THREE.Scene();
var camera;
var renderer;
var controls;
var effect;
var followBlock;
var dummy;

function CreateScene() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    CreateCamera();
    CreateGroudPlane();
    CreateSceneLighting();
    CreateBlocks();

    var geometry = new THREE.BoxGeometry(.3, .3, .3);
    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 });

    followBlock = new THREE.Mesh(geometry, material);
    followBlock.position.set(0, 0, 1);
    dummy = new THREE.Object3D();;
    dummy.add(followBlock);
    scene.add(dummy);

    window.addEventListener('resize', onWindowResize, false);
    render();
}

function CreateCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        controls = new THREE.DeviceOrientationControls(camera);
    effect = new THREE.StereoEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
}

function CreateGroudPlane() {
    var geometry = new THREE.BoxGeometry(300, 5, 200);
    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -10, 0);

    scene.add(mesh);
}

function CreateSceneLighting() {
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    window.scene.add(light);

    light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    window.scene.add(light);

    light = new THREE.AmbientLight(0x222222);
    window.scene.add(light);
}

function CreateBlocks() {
    for (var i = -2; i < 2; i++) {
        for (var j = -2; j < 2; j++) {
            if (i != 0 && j != 0) {
                var mesh = CreateBlock();
                mesh.position.set(i * 3, 1, j * 3);
                scene.add(mesh);
            }
        }
    }
}

function CreateBlock() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial( { color: 0x0000ff });
    var blockMesh = new THREE.Mesh( geometry, material );
    blockMesh.isAsset = true;
    return blockMesh;
}

function render() {
    requestAnimationFrame(render);
    if (controls)
        controls.update();
    effect.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    effect.setSize(window.innerWidth, window.innerHeight);
}