var bus = require('postal');
var source = 'Leap Motion to BVH Converter';

var THREE = require('three');

var renderer, scene, camera, controls, stats;
var clock = new THREE.Clock();
clock.previousTime = 1000000;

var info, numbers, textareaStatus, textarea, tmpText = '';
var count = 0, frames = 0, tim;
var pausedFrame = null;
var latestFrame = null;

var pointableTips = [], pointableTargets = [], pointableKnuckles = [];
var data, hand3D, fingerTips = [], fingerBases = [];
var pi = Math.PI, pi2 = 2 * Math.PI, pi05 = 0.5 * Math.PI;
var d2r = pi / 180, r2d = 180 / pi;

module.exports =
{
    Initialize: function () {
        bus.subscribe({
            channel: "Input.Raw",
            topic: "Leap",
            callback: function (data, envelope) {
                // Convert to BVH

            }
        });

        init();
    },
    Start: function () {

    }
}



function init() {
    var light, geometry, material, mesh;

    scene = new THREE.Scene();
    
    // Assets		
    geometry = new THREE.CubeGeometry(8, 8, 8);
    material = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
    leapHand3D = new THREE.Mesh(geometry, material);
    scene.add(leapHand3D);

    vector = v(1, 1, 1);

    hand3D = new THREE.Object3D();
    scene.add(hand3D);

    var shape = new THREE.Shape([v2(-37, 25), v2(-15, 25), v2(-15, 15), v2(13, 15), v2(13, 20), v2(35, 20), v2(35, 38), v2(53, 38), v2(53, 100), v2(-33, 100)]);
    geometry = shape.extrude({ amount: 10, bevelEnabled: false });
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-pi05));
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -10, 0));
    material = new THREE.MeshBasicMaterial({ color: 0xcccccc, opacity: 0.5, side: THREE.DoubleSide, transparent: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    hand3D.add(mesh);
    
    // The following parameters adjust the location of the fingerBases positions
    // A slight change here defines whether finger movements look realistic or not
    // It would be great if the user were able to adjust the following parameters
    // It would be even better if the code did the adjusting automatically		
    var tranX = [-30, -30, 0, 30, 50];
    var tranZ = [-40, 1, 15, 11, -20];
    var lenZ = [30, 30, 38, 35, 20];
    material = new THREE.MeshNormalMaterial();
    
    for (var i = 0; i < 5; i++) {
        
        // pountableTips, pointableTargets and pointableKnuckles are all dummy objects
        // used to position and rotate fingerTips and fingerBases
        // All these dummies may not be required, but really help while debugging and adjusting the spacing
        geometry = new THREE.CubeGeometry(8, 8, 8);
        material = new THREE.MeshNormalMaterial();
        mesh = new THREE.Mesh(geometry, material);
        pointableTips.push(mesh);
        scene.add(mesh);
        
        geometry = new THREE.CubeGeometry(3, 3, 3);
        mesh = new THREE.Mesh(geometry, material);
        pointableTargets.push(mesh);
        scene.add(mesh);
        
        geometry = new THREE.CubeGeometry(3, 10, 3);
        mesh = new THREE.Mesh(geometry, material);
        pointableKnuckles.push(mesh);
        scene.add(mesh);
        geometry = new THREE.CubeGeometry(16, 12, lenZ[i]);
        //geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -5, 0 ) );
        material = new THREE.MeshBasicMaterial({ color: 0xcccccc, opacity: 0.7, side: THREE.DoubleSide, transparent: true });
        
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = tranX[ i ];
        mesh.position.z = tranZ[ i ];
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        fingerBases.push(mesh);
        hand3D.add(mesh);
        
        geometry = new THREE.CubeGeometry(16, 12, lenZ[i]);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -20));
        
        mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        fingerTips.push(mesh);
        hand3D.add(mesh);
    }
}

function convertToThree() {
    // adjust number of frames captured per second. Leap captures ~100/second
    if (count++ % 3 > 0) return;
    
    if (frame.hands.length > 0) {
        handLeap = frame.hands[0];
        position = v(handLeap.stabilizedPalmPosition[0], handLeap.stabilizedPalmPosition[1], handLeap.stabilizedPalmPosition[2]);
        leapHand3D.position = position;
        leapHand3D.rotation.set(handLeap.pitch(), -handLeap.yaw(), handLeap.roll());
        
        hand3D.position = position;
        direction = v(handLeap.direction[0], handLeap.direction[1], handLeap.direction[2]);
        hand3D.lookAt(direction.add(hand3D.position));
        hand3D.rotation.z = -handLeap.roll();
        //hand3D.rotation.set( handLeap.pitch(), -handLeap.yaw(), handLeap.roll() );
        
        leapHand3D.visible = true;
        hand3D.visible = true;
    } else {
        leapHand3D.visible = false;
        hand3D.visible = false;
    }
    
    len = frame.pointables.length;
    
    if (len > 0 && handLeap) {
        hand3D.hasFingers = true;
        if (len > 4) {
            var pointablesX;
            var pointablesXsortedClone;
            hand3D.hasFiveIds = true;
            hand3D.positionPrevious = hand3D.position.clone();
            pointablesX = [];
            for (var i = 0; i < len; i++) {
                pointablesX.push(frame.pointables[i].stabilizedTipPosition[0]);
            }
            pointablesXsortedClone = pointablesX.slice(0);
            pointablesXsortedClone.sort(function (a, b) { return a - b; });
            for (var i = 0; i < len; i++) {
                index = pointablesX.indexOf(pointablesXsortedClone[ i ]);
                pointable = frame.pointables[ index ];
                fingerTips[ i ].pointableId = pointable.id;
                fingerTips[ i ].pointableIndex = index;
            }
        }
    } else if (hand3D.hasFingers) {
        hand3D.hasFingers = false;
        hand3D.hasFiveIds = false;
        return;
    }
    
    if (hand3D.hasFiveIds) {
        var meaningOfLife = [4, 2, 0, 1, 3];
        
        txt = '' + hand3D.position.x.toFixed(2) + ' ' + hand3D.position.y.toFixed(2) + ' ' + hand3D.position.z.toFixed(2) + ' ' +
				(r2d * hand3D.rotation.z).toFixed(2) + ' ' + (r2d * hand3D.rotation.y).toFixed(2) + ' ' + (r2d * hand3D.rotation.x).toFixed(2) + ' ';
        txt += '0 0 0 ';
        
        var fingerTip, pointableTip, pointableTarget, pointableKnuckle, index;
        for (var i = 0; i < 5; i++) {
            fingerTip = fingerTips[ i ];
            index = fingerTip.pointableIndex;
            pointable = frame.pointables[ index  ];
            if (pointable && pointable.id === fingerTip.pointableId) {
                position = v(pointable.stabilizedTipPosition[0], pointable.stabilizedTipPosition[1], pointable.stabilizedTipPosition[2]);
                direction = v(pointable.direction[0], pointable.direction[1], pointable.direction[2]);
                pointableTip = pointableTips[ index ];
                pointableTip.position.copy(position);
                pointableTip.lookAt(position.clone().add(direction));
                pointableTarget = pointableTargets[ index ];
                pointableTarget.position.copy(position);
                pointableTarget.lookAt(direction.clone().add(position));
                pointableTarget.translateZ(pointable.length);
                
                pointableKnuckle = pointableKnuckles[ index ];
                pointableKnuckle.position.copy(position);
                pointableKnuckle.lookAt(direction.clone().add(position));
                pointableKnuckle.translateZ(-pointable.length);
                
                fingerTip.position.copy(hand3D.worldToLocal(position.clone()));
                fingerTip.lookAt(hand3D.worldToLocal(pointableTarget.position.clone()));
                
                fingerBases[i].lookAt(hand3D.worldToLocal(pointableKnuckle.position.clone()));
            }
            txt += ' ' + (r2d * fingerBases[i].rotation.z).toFixed(2) + ' ' + (r2d * fingerBases[i].rotation.y).toFixed(2) + ' ' + (r2d * fingerBases[i].rotation.x).toFixed(2);
            txt += ' ' + (r2d * fingerTip.rotation.z).toFixed(2) + ' ' + (r2d * fingerTip.rotation.y).toFixed(2) + ' ' + (r2d * fingerTip.rotation.x).toFixed(2);
            txt += ' 0 0 0 ';
        }
        tmpText += txt + '\n';
        frames++;
        
        // comment out following 3 lines on slow machines	
        tim = clock.getDelta().toFixed(3);
        numbers.innerHTML = 'Frames: ' + frames + ' Seconds/frame:' + tim + ' - Hand rotation X: ' + (r2d * fingerTips[0].rotation.x).toFixed(1) + ' y: ' + 
				(r2d * fingerTips[0].rotation.y).toFixed(1) + ' z: ' + (r2d * fingerTips[0].rotation.z).toFixed(1);
    }
}