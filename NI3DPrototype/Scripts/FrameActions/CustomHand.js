/// <reference path="../../Libs/THREEJS/three.js" />
/// <reference path="../HandController.js" />
/// <reference path="../FrameActions.js" />

var fingerlings = {};
var handies = {};

var Handy = function () {
    var handy = this;
    //var msg = handData.appendChild(document.createElement('div'));
    var geometry = new THREE.BoxGeometry(50, 20, 50);
    var material = new THREE.MeshNormalMaterial();
    var box = new THREE.Mesh(geometry, material);
    scene.add(box);
    handy.outputData = function (id, hand) {
        //msg.innerHTML = 'Hand id:' + id + ' x:' + hand.stabilizedPalmPosition[0].toFixed(0) +
        //    ' y:' + hand.stabilizedPalmPosition[1].toFixed(0) + ' z:' + hand.stabilizedPalmPosition[2].toFixed(0);
        box.position.set(hand.stabilizedPalmPosition[0], hand.stabilizedPalmPosition[1], hand.stabilizedPalmPosition[2]);
        box.rotation.set(hand.pitch(), -hand.yaw(), hand.roll());
        handy.hand = hand;

    };
};

// Bone Method
var Fingerling = function () {
    var fingerling = this;
    var phalanges = [], phalange;
    for (var i = 0; i < 4; i++) {
        phalange = addPhalange();
        phalanges.push(phalange)
    }

    fingerling.phalanges = phalanges;
    //var msg = fingerData.appendChild(document.createElement('div'));

    fingerling.outputData = function (id, finger) {
        //msg.innerHTML = 'Bone Method ~ ' +
        //    'finger tip: ' + id + ' x:' + finger.tipPosition[0].toFixed(0) +
        //    ' y:' + finger.tipPosition[1].toFixed(0) + ' z:' + finger.tipPosition[2].toFixed(0);

        //console.log( finger );
        var bone, cen, len;
        for (var i = 0; i < 4; i++) {
            bone = finger.bones[i];
            cen = bone.center();
            len = bone.length;
            phalange = phalanges[i];
            phalange.position.set(cen[0], cen[1], cen[2]);
            if (id > 0 || i > 0) {
                phalange.scale.z = len;
            }

            fingerling.finger = finger;
        }

        // Eventually will look at using bone.basis XYZ-axis data; Will it produce more concise code?

        phalanges[3].lookAt(v(finger.tipPosition[0], finger.tipPosition[1], finger.tipPosition[2]));
        phalanges[2].lookAt(v(finger.dipPosition[0], finger.dipPosition[1], finger.dipPosition[2]));
        phalanges[1].lookAt(v(finger.pipPosition[0], finger.pipPosition[1], finger.pipPosition[2]));
        if (id > 0) {
            phalanges[0].lookAt(v(finger.mcpPosition[0], finger.mcpPosition[1], finger.mcpPosition[2]));
        }
        fingerling.finger = finger;
    };
};

function addPhalange() {
    geometry = new THREE.BoxGeometry(20, 20, 1);
    material = new THREE.MeshNormalMaterial();
    phalange = new THREE.Mesh(geometry, material);
    scene.add(phalange);
    return phalange;
}

function v(x, y, z) { return new THREE.Vector3(x, y, z); }


var DisplayHand = function (frame) {
    frame.hands.forEach(function (hand, id) {
        var handy = (handies[id] || (handies[id] = new Handy()));
        handy.outputData(id, hand);
        hand.fingers.forEach(function (finger, id) {
            var fingerling = (fingerlings[hand.type + id] || (fingerlings[hand.type + id] = new Fingerling()));
            fingerling.outputData(hand.type + id, finger);
        });
    });
}


//inject into frameActions
frameActions.RegisterAction("DisplayHands", DisplayHand);