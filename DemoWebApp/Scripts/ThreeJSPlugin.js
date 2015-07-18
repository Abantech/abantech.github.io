var mesh;

var camera, scene, renderer;

ThreeJSPlugin = {

    Log: function (data)
    {
        console.log(data.message);
    },

    Extrude: function (data, returnedFromFunction)
    {
        if (mesh)
        {
            if (mesh.scale.x == 2)
            {
                mesh.scale.set(1, 1, 1);
            }
            else
            {
                mesh.scale.set(2, 2, 2);
            }

            returnedFromFunction.publishResults = true;
            returnedFromFunction.MyUpdatedAsset = mesh;
        }
    },

    MyFunction: function ()
    {
        console.log("CHAINED");
    },

    Translate: function Translate(data, returnedFromFunction)
    {

        console.log("Translate Called");

        if (mesh)
        {
            if (mesh.position.x === 0)
            {
                mesh.position.x = 150;
                mesh.position.y = 150;
                mesh.position.z = 150;
            }
            else
            {
                mesh.position.x = 0;
                mesh.position.y = 0;
                mesh.position.z = 0;
            }

            returnedFromFunction.publishResults = true;
        }

        returnedFromFunction.MyUpdatedAsset = mesh;
        returnedFromFunction.MyMessage = "Message from within sketchup";
    },

    Create: function (data, returnedFromFunction)
    {
        returnedFromFunction.publishResults = false;

        if (!mesh)
        {
            console.log("Create Called");

            geometry = new THREE.BoxGeometry(200, 200, 200);
            material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

            mesh = new THREE.Mesh(geometry, material);

            scene.add(mesh);

            returnedFromFunction.MyUpdatedAsset = mesh;
            returnedFromFunction.publishResults = true;
        }
        //else
        //{
        //    scene.remove(mesh);
        //    returnedFromFunction.MyOldAsset = mesh;

        //    console.log("Create Called");

        //    geometry = new THREE.BoxGeometry(200, 200, 200);

        //    var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        //    material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });

        //    mesh = new THREE.Mesh(geometry, material);

        //    scene.add(mesh);

        //    returnedFromFunction.MyNewAsset = mesh;
        //    returnedFromFunction.publishResults = true;
        //}
    }
}

function init()
{
    console.log("Asdf");
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

function animate()
{
    requestAnimationFrame(animate);

    if (mesh)
    {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
    }

    renderer.render(scene, camera);
}

init();
animate();