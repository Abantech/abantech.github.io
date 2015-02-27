THREE.ObjectLoader.prototype.parseObject = function () {

    var matrix = new THREE.Matrix4();

    return function ( data, geometries, materials ) {

        var object;

        switch ( data.type ) {

            case 'Scene':

                object = new THREE.Scene();

                break;

            case 'PerspectiveCamera':

                object = new THREE.PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

                break;

            case 'OrthographicCamera':

                object = new THREE.OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

                break;

            case 'AmbientLight':

                object = new THREE.AmbientLight( data.color );

                break;

            case 'DirectionalLight':

                object = new THREE.DirectionalLight( data.color, data.intensity );

                break;

            case 'PointLight':

                object = new THREE.PointLight( data.color, data.intensity, data.distance );

                break;

            case 'SpotLight':

                object = new THREE.SpotLight( data.color, data.intensity, data.distance, data.angle, data.exponent );

                break;

            case 'HemisphereLight':

                object = new THREE.HemisphereLight( data.color, data.groundColor, data.intensity );

                break;

            case 'Mesh':

                var geometry = geometries[ data.geometry ];
                var material = materials[ data.material ];

                if ( geometry === undefined ) {

                    console.warn( 'THREE.ObjectLoader: Undefined geometry', data.geometry );

                }

                if ( material === undefined ) {

                    console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

                }

                object = new THREE.Mesh( geometry, material );

                break;

            case 'Line':

                var geometry = geometries[ data.geometry ];
                var material = materials[ data.material ];

                if ( geometry === undefined ) {

                    console.warn( 'THREE.ObjectLoader: Undefined geometry', data.geometry );

                }

                if ( material === undefined ) {

                    console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

                }

                object = new THREE.Line( geometry, material );

                break;

            case 'Sprite':

                var material = materials[ data.material ];

                if ( material === undefined ) {

                    console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

                }

                object = new THREE.Sprite( material );

                break;

            case 'Group':

                object = new THREE.Group();

                break;

            default:

                object = new THREE.Object3D();

        }

        object.uuid = data.uuid;

        if ( data.name !== undefined ) object.name = data.name;
        if ( data.matrix !== undefined ) {

            matrix.fromArray( data.matrix );
            matrix.decompose( object.position, object.quaternion, object.scale );

        } else {

            if ( data.position !== undefined ) object.position.fromArray( data.position );
            if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
            if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

        }

        if ( data.visible !== undefined ) object.visible = data.visible;
        if ( data.userData !== undefined ) object.userData = data.userData;

        if ( data.children !== undefined ) {

            for ( var child in data.children ) {

                object.add( this.parseObject( data.children[ child ], geometries, materials ) );

            }

        }

        return object;

    }

}