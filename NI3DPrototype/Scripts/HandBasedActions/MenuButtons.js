/// <reference path="D:\Dev-Workspace\AbantechProjects\abantech.github.io\NI3DPrototype\Libs/THREEJS/three.js" />



var newShapesButton = new THREE.Mesh(
  new THREE.SphereGeometry(window.innerWidth / 200, 16, 16),
  new THREE.MeshPhongMaterial({ wireframe: false })
);

newShapesButton.position.set(window.innerWidth / 12, window.innerHeight / 16, 10);
window.scene.add(newShapesButton);

var changeButtonColorToRed = function (hand) {
    //if (isButtonPressed(hand, newShapesButton))
    newShapesButton.material.color.setHex(isButtonPressed(hand, newShapesButton) ? 0xff0000 : 0x0000ff);
};

var clock = null
var box = null;

var createBoxAfterDelay = function (hand) {
    if (isButtonPressed(hand, newShapesButton)) {
        if (!clock){
            clock = new THREE.Clock(true);
            clock.start();
        } else {
            if (clock.getElapsedTime() > 0.750) {
                if (box) {
                    box.rotation.x += 0.001;
                    box.rotation.y += 0.03;
                } else {
                    box = createBox(40, new THREE.Vector3(0, 0, 0), 0xabcdef);
                    window.scene.add(box);
                    clock = null;
                }
            }
        }
    } else {
        clock = null;
    }

}

//Draws a 3D dimensional object (sphere for now) of a given size and at the specified screen position
function createBox(size, position, meshColor) {
    var geom = new THREE.BoxGeometry(size, size, size);
    var material = new THREE.MeshNormalMaterial(meshColor)
    var mesh = new THREE.Mesh(geom, material)

    mesh.position.copy(position);

    //Unsure if still needed:
    //sphere.updateMatrix();
    //sphere.matrixAutoUpdate = false;
    return mesh;
}

function isButtonPressed(hand, button) {
    var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);
    //!?! Have to use the thumb as the other end of the ray, do not know why it's not working with the pipPosition or mcpPosition
    var indexPipVector = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);

    var dir = new THREE.Vector3();
    dir.subVectors(indexTipVector, indexPipVector).normalize();

    var raycaster = new THREE.Raycaster(indexPipVector, dir, 0, 200);

    var intersection = raycaster.intersectObject(button, true);
    return intersection.length > 0;
}