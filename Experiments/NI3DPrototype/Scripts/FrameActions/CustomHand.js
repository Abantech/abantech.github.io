/// <reference path="../../Libs/THREEJS/three.js" />
/// <reference path="../HandController.js" />
/// <reference path="../FrameActions.js" />

var fingerlings = {};
var handies = {};
var handMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });

var Handy = function () {
    var handy = this;
    var geometry = new THREE.BoxGeometry(35, 8, 40);
    var box = new THREE.Mesh(geometry, handMaterial);
    scene.add(box);
    handy.outputData = function (id, hand) {
        box.position.set(hand.palmPosition[0], hand.palmPosition[1], hand.palmPosition[2]);
        box.rotation.set(hand.pitch(), -hand.yaw(), hand.roll());
        handy.hand = hand;

    };
};

// Bone Method
var Fingerling = function () {
    var fingerling = this;
    var phalanges = [], phalange;

    for (var i = 0; i < 4; i++)
    {
        phalange = addPhalange();
        phalanges.push(phalange)
    }

    fingerling.phalanges = phalanges;

    fingerling.lastSeen = null;;

    fingerling.outputData = function (id, finger) {
        var bone, cen, len;
        for (var i = 0; i < 4; i++) {
            bone = finger.bones[i];
            cen = bone.center();
            len = bone.length;
            phalange = phalanges[i];
            phalange.position.set(cen[0], cen[1], cen[2]);
            if (id > 0 || i > 0) {
                phalange.scale.z = len/6;
            }

            phalange.visible = true;
            //fingerling.finger = finger;
        }

        // Eventually will look at using bone.basis XYZ-axis data; Will it produce more concise code?
        phalanges[3].lookAt(new THREE.Vector3().fromArray(finger.tipPosition));
        phalanges[2].lookAt(new THREE.Vector3().fromArray(finger.dipPosition));
        phalanges[1].lookAt(new THREE.Vector3().fromArray(finger.pipPosition));

        //if (id > 0) {
        //    phalanges[0].lookAt(new THREE.Vector3().fromArray(finger.mcpPosition));
        //}
        fingerling.finger = finger;
        fingerling.lastSeen = new Date();
    };

    
};

function addPhalange() {
    geometry = new THREE.SphereGeometry(4, 16, 16);
    phalange = new THREE.Mesh(geometry, handMaterial);
    scene.add(phalange);
    return phalange;
}


frameActions.RegisterAction("DisplayHands",
    function (frame) {
        frame.hands.forEach(function (hand, id) {
            //var handy = (handies[id] || (handies[id] = new Handy()));
            //handy.outputData(id, hand);
            hand.fingers.forEach(
                function (finger, id)
                {
                    var fingerlingID = hand.type + '-' + id;
                    var fingerling = (fingerlings[fingerlingID] || (fingerlings[fingerlingID] = new Fingerling()));
                    fingerling.outputData(fingerlingID, finger);
                }
            );
        });

        var currentTime = new Date();

        for (var obj in fingerlings)
        {
            if ((currentTime - fingerlings[obj].lastSeen) > 10)
            {
                fingerlings[obj].phalanges.forEach(
                    function (phalange) {
                        phalange.visible = false;
                    })
            }
        }
    });