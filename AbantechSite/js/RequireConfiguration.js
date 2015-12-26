var require = {
    //By default load any module IDs from js/lib
    baseUrl: '.',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        lodash: 'https://cdn.rawgit.com/lodash/lodash/3.10.1/lodash.min',
        postal: 'https://cdn.rawgit.com/postaljs/postal.js/master/lib/postal.min',
        THREE: 'http://threejs.org/build/three.min',
        leapjs: 'https://cdn.rawgit.com/leapmotion/leapjs/master/leap-0.6.4.min',
        annyang: 'https://cdn.rawgit.com/TalAter/annyang/master/annyang',
        gyronorm: 'https://cdn.rawgit.com/dorukeker/gyronorm.js/master/dist/gyronorm.complete.min',
        promise: 'https://www.promisejs.org/polyfills/promise-6.1.0',
        autobahn: 'https://autobahn.s3.amazonaws.com/autobahnjs/latest/autobahn.min',
        realsense: 'js/lib/realsense'
    },
    shim: {
        'leapjs': { exports: 'Leap' },
        'annyang': { exports: 'annyang' },
        'gyronorm': { exports: 'GyroNorm' },
        'realsense': { exports: 'intel.realsense' },
        'autobahn': { exports: 'autobahn' }
    }
};