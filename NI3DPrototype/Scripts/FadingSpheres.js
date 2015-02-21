var fadingSpheres = [];
var sphereTTL = 7;

var createFadingSpheresAtFingerTips =
    {
        action: function (hand)
        {
            function createSphereAtFingerTip(fingerIndex, colorHex)
            {
                pos = (new THREE.Vector3()).fromArray(hand.fingers[fingerIndex].tipPosition);
                new FadingSphere(pos, 3, colorHex);
            }

            createSphereAtFingerTip(0, 0xF57E20) //Thumb
            createSphereAtFingerTip(1, 0xFFCC00) //Index
            createSphereAtFingerTip(2, 0xCCCC51) //Middle
            createSphereAtFingerTip(3, 0x8FB258) //Ring
            createSphereAtFingerTip(4, 0x336699) //pinky
        }
    }

function FadingSphere(position, size, meshColor) {
    //Draw the sphere at the position of the indexfinger tip position
    var geometry = new THREE.SphereGeometry(3, 8, 8);
    var material = new THREE.MeshLambertMaterial({ color: meshColor });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.material.ambient = mesh.material.color;

    mesh.position.copy(position)

    this.sphere = mesh;

    window.scene.add(this.sphere);
    fadingSpheres.push(this);

    this.ttl = sphereTTL;
    this.updateToRemove = function () {
        this.ttl--;
        return (this.ttl <= 0);
    }
}

function removeDeadSpheres(fadingSphere, number, array) {
    if (fadingSphere) {
        if (fadingSphere.updateToRemove()) {
            window.scene.remove(fadingSphere.sphere);
            var index = array.indexOf(fadingSphere);
            array.splice(index, 1);
        }
    }
}

if (frameActions)
    frameActions.RegisterAction("CreateAndRemoveSpheres",
        function (frame) {
            frame.hands.forEach(
                function (hand) {
                    createFadingSpheresAtFingerTips.action(hand);
                });
            fadingSpheres.forEach(removeDeadSpheres)
        });