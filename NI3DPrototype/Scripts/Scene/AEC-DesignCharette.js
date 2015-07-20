var defaultColor = 0x36454f
var voiceFeedback = true;

function createBoxes()
{
    //var driveway = new THREE.Mesh(new THREE.BoxGeometry(18, 3, 80), new THREE.MeshPhongMaterial({ color: 0x36454f, transparent: true, opacity: 0.3 }));
    //driveway.position.set(30, -47, 70)
    //scene.add(driveway);
    //driveway.rotation.x = 0.03
    //assetManager.CreateAsset("Cube", driveway, true);

    //var plat = new THREE.Mesh(new THREE.BoxGeometry(160, 1, 286), new THREE.MeshPhongMaterial({ color: 0x006400, transparent: true, opacity: 0.4 }));
    //plat.position.set(0, -48, -33)
    //scene.add(plat);
    //assetManager.CreateAsset("Cube", plat, true);

    //var setbacks = new THREE.Mesh(new THREE.BoxGeometry(120, 1, 166), new THREE.MeshPhongMaterial({ color: 0x36454f, transparent: true, opacity: 0.75 }));
    //setbacks.position.set(0, -47.8, -23)
    //scene.add(setbacks);
    //assetManager.CreateAsset("Cube", setbacks, true);
    //plat.rotation.x = 0.03

    var halfCount = 3;

    for (var i = 0; i < halfCount * 2; i++) {
        var box = makeContainer({ color: defaultColor });
        box.position.set(24 * (i % halfCount) + 100, -30, (-100 * ((i - 1) / halfCount).toFixed(0)) - 30);
        assetManager.CreateAsset("Cube", box);
    }

        for (var i = 0; i < halfCount * 2; i++) {
        var box = makeContainer({ color: defaultColor });
        box.position.set(-24 * (i % halfCount) - 100, -30, (-100 * ((i - 1) / halfCount).toFixed(0)) - 30);
        assetManager.CreateAsset("Cube", box);
    }

    for (var i = 0; i < 5; i++) {
        var box = makeContainer({ geo : new THREE.BoxGeometry(16, 19, 40), color: defaultColor });
        box.position.set(-24 * i - 100, -30, 50);
        assetManager.CreateAsset("Cube", box);
    }
    

    for (var i = 0; i < 4; i++) {
        var box = makeContainer({ geo: new THREE.BoxGeometry(40, 19, 16), color: defaultColor });
        box.position.set(110, -30, 20 * i + 37);
        assetManager.CreateAsset("Cube", box);
    }

/*
    // Connection
    shape = new THREE.Shape();
    shape.fromPoints([v2(-8, -18), v2(-8, 18), v2(5, 18), v2(12, -18)]);

    geometry = shape.extrude({ amount: 18, bevelEnabled: false });
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    box = makeContainer({ geo: geometry, showEdges: false });
    box.material.color.setHex(0xbb6600);
    //box.material.color = 0xff0000;
    box.position.set(0, 18, 0);

    geometry = new THREE.BoxGeometry(8, 26, 8);
    box = makeContainer({ geo: geometry, color: defaultColor })
    box.position.set(-2, 9, 0);
    box.rotation.y = Math.PI / 4;
*/

    //SKYBOX!
    var url = window.location.href;

    if (url.substring(0, 4) != "file")
    {
        var skyBox = createSkybox();
        skyBox.position.set(0, 100, 0)
        scene.add(skyBox);
    }
}

function createSkybox() {
    var files = ['px', 'nx', 'top', 'ny', 'pz', 'nz']
    var materials = [];
    for (var i = 0, image; i < 6; i++) {
        image = THREE.ImageUtils.loadTexture('Images/skyboxes/land1/' + files[i] + '.jpg');
        materials.push(new THREE.MeshBasicMaterial({ map: image, side: THREE.BackSide }));
    }

    return new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), new THREE.MeshFaceMaterial(materials));
}

function makeContainerByVoice(size) {
    if (size.toUpperCase() == "SMALL" || size == "20")
    {
        var box = makeContainer({ geo: new THREE.BoxGeometry(40, 19, 16) });
        assetManager.CreateAsset("Cube", box);

        box.position.set(0,0,0);
    }

    if (size.toUpperCase() == "MEDIUM" || size == "30T")
    {
        var box = makeContainer({ geo: new THREE.BoxGeometry(60, 19, 16) });
        assetManager.CreateAsset("Cube", box);

        box.position.set(0,0,0);
    }

    if (size.toUpperCase() == "LARGE" || size == "40" || size.toUpperCase() == "FOURTY FOOT")
    {
        var box = makeContainer({ geo: new THREE.BoxGeometry(80, 19, 16) });
        assetManager.CreateAsset("Cube", box);

        box.position.set(0,0,0);
    }
}

function makeContainer(options) {

    var geometry = typeof (options) != "undefined" && typeof (options.geo) != "undefined" ? options.geo : new THREE.BoxGeometry(16, 19, 80);
    var colorHex = typeof (options) != "undefined" && typeof (options.color) != "undefined" ? options.color : 0xffffff * Math.random()
    var showEdges = typeof (options) != "undefined" && typeof (options.showEdges) != "undefined" ? options.showEdges : true


    //geometry = geo ? geo : new THREE.BoxGeometry( 40, 8, 8 );
    var material = new THREE.MeshPhongMaterial({
        opacity: 0.85,
        shininess: 0,
        transparent: true
    });

    material.color.setHex(colorHex)
    material.specular.setHex(colorHex)

    var mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    return mesh
}

function Speak(message)
{
    if (voiceFeedback)
    {
        var utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
    }
}