var addHandlesToSelectedAssets =
{

    DoAction: function (frame)
    {
        var handle, sprites;

        var map = THREE.ImageUtils.loadTexture("ball.png");
        var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
        handle = new THREE.Sprite(material);

        var assets = assetManager.GetSelected();

        for (var i = 0; i < assets.length; i++)
        {

        }
        verts = intersected.geometry.vertices;

        sprites = new THREE.Object3D();

        scene.add(sprites);

        for (var i = 0, v, sprite; i < verts.length; i++)
        {

            v = verts[i].clone();

            v.applyMatrix4(intersected.matrixWorld);

            sprite = handle.clone();

            sprite.position.set(v.x, v.y, v.z);

            sprites.add(sprite);

        }
    }
}