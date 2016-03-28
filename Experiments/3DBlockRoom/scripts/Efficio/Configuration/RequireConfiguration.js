var require = {
    //By default load any module IDs from js/lib
    baseUrl: '.',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.

    paths: {
        lodash: ['https://cdn.rawgit.com/lodash/lodash/3.10.1/lodash.min', 'resources/local-libs/lodash.min'],
        postal: ['https://cdn.rawgit.com/postaljs/postal.js/master/lib/postal.min', 'resources/local-libs/postal.min'],
        three: ['http://threejs.org/build/three.min', 'resources/local-libs/three.min'],
        leapjs: ['https://cdn.rawgit.com/leapmotion/leapjs/master/leap-0.6.4.min', 'resources/local-libs/leap-0.6.4.min'],
        annyang: ['https://cdn.rawgit.com/TalAter/annyang/master/annyang', 'resources/local-libs/annyang.min'],
        gyronorm: ['https://cdn.rawgit.com/dorukeker/gyronorm.js/master/dist/gyronorm.complete.min', 'resources/local-libs/gyronorm.complete.min'],
        promise: ['https://www.promisejs.org/polyfills/promise-6.1.0', 'resources/local-libs/promise-6.1.0.min'],
        autobahn: ['https://autobahn.s3.amazonaws.com/autobahnjs/latest/autobahn.min', 'resources/local-libs/autobahn.min'],
        realsense: 'scripts/libs/realsense/realsense',
        'leap-plugins': ['http://js.leapmotion.com/leap-plugins-0.1.11', 'resources/local-libs/autobahn.min'], 
        'riggedHand': ['http://js.leapmotion.com/leap.rigged-hand-0.1.7', 'resources/local-libs/leap.rigged-hand-0.1.7.min'],
        firebase: ['https://cdn.firebase.com/js/client/2.2.1/firebase', 'resources/local-libs/firebase.js']
    },
    shim: {
        'leapjs': { exports: 'Leap' },
        'annyang': { exports: 'annyang' },
        'gyronorm': { exports: 'GyroNorm' },
        'realsense': { exports: 'intel.realsense' },
        'autobahn': { exports: 'autobahn' },
        firebase: { exports: 'Firebase' }
    }
};

/*
//Force use of local paths
    paths: {
        lodash: ['resources/local-libs/lodash.min'],
        postal: ['resources/local-libs/postal.min'],
        three: ['resources/local-libs/three.min'],
        leapjs: ['resources/local-libs/leap-0.6.4.min'],
        annyang: ['resources/local-libs/annyang.min'],
        gyronorm: ['resources/local-libs/gyronorm.complete.min'],
        promise: ['resources/local-libs/promise-6.1.0.min'],
        autobahn: ['resources/local-libs/autobahn.min'],
        realsense: 'scripts/libs/realsense/realsense',
        'leap-plugins': ['resources/local-libs/autobahn.min'], 
        'riggedHand': ['resources/local-libs/leap.rigged-hand-0.1.7.min'],
        firebase: ['resources/local-libs/firebase.js']
    },
*/