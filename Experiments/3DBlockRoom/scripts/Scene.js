var scene = new THREE.Scene();
var camera;
var renderer;
var controls;
var effect;
var followBlock;
var dummy;
var worldWidth = 256, worldDepth = 256,
			worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var falloffColor = "#192034";

function CreateScene()
{
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( falloffColor );
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );

    CreateCamera();

    scene.fog = new THREE.FogExp2( falloffColor, 0.0025 );
    data = generateHeight( worldWidth, worldDepth );
    camera.position.y = data[worldHalfWidth + worldHalfDepth * worldWidth] * 10 + 200;
    var geometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
    geometry.rotateX( -Math.PI / 2 );
    var vertices = geometry.attributes.position.array;
    for ( var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3 )
    {
        vertices[j + 1] = data[i] * 10;
    }
    texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {
        color: new THREE.Color().setHSL( 0.3, 0.75, ( i / 15 ) * 0.4 + 0.1 ),
        map: texture,
    } ) );
    scene.add( mesh );

    var geometry = new THREE.BoxGeometry( .3, .3, .3 );
    var material = new THREE.MeshNormalMaterial();

    window.addEventListener( 'resize', onWindowResize, false );
    render();
}

function generateHeight( width, height )
{
    var size = width * height, data = new Uint8Array( size ),
    perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;
    for ( var j = 0; j < 4; j++ )
    {
        for ( var i = 0; i < size; i++ )
        {
            var x = i % width, y = ~~( i / width );
            data[i] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
        }
        quality *= 5;
    }
    return data;
}

function generateTexture( data, width, height )
{
    var canvas, canvasScaled, context, image, imageData,
    level, diff, vector3, sun, shade;
    vector3 = new THREE.Vector3( 0, 0, 0 );
    sun = new THREE.Vector3( 1, 1, 1 );
    sun.normalize();
    canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );
    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;
    for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++ )
    {
        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();
        shade = vector3.dot( sun );
        imageData[i] = ( 96 + shade * 128 ) * ( 0.5 + data[j] * 0.007 );
        imageData[i + 1] = ( 32 + shade * 96 ) * ( 0.5 + data[j] * 0.007 );
        imageData[i + 2] = ( shade * 96 ) * ( 0.5 + data[j] * 0.007 );
    }
    context.putImageData( image, 0, 0 );
    // Scaled 4x
    canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;
    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );
    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;
    for ( var i = 0, l = imageData.length; i < l; i += 4 )
    {
        var v = ~~( Math.random() * 5 );
        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }
    context.putImageData( image, 0, 0 );
    return canvasScaled;
}

function CreateCamera()
{
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) )
    {
        controls = new THREE.DeviceOrientationControls( camera );
        effect = new THREE.StereoEffect( renderer );
        effect.setSize( window.innerWidth, window.innerHeight );
    }
}

function CreateSceneLighting()
{
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    window.scene.add( light );

    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    window.scene.add( light );

    light = new THREE.AmbientLight( 0x222222 );
    window.scene.add( light );
}

function render()
{
    requestAnimationFrame( render );
    if ( controls )
        controls.update();

    if ( effect )
    {
        effect.render( scene, camera );
    }
    else
    {
        renderer.render( scene, camera );
    }
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    if ( effect )
    {
        effect.setSize( window.innerWidth, window.innerHeight );

    }
}