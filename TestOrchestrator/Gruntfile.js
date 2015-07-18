module.exports = function (grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                src: ['./src/**/*.js'],
                dest: '../Deployment/<%= pkg.name %>.js'
            }
        },
        copy: 
 {
            test: {
                files: [
    //{ expand: true, src: './3D System Interface/ActionToFunctionMapping.js', dest: '../DemoWebApp/Scripts/', filter: 'isFile', flatten: true },
    //{ expand: true, src: './public/SketchUp.js', dest: '../DemoWebApp/Scripts/', filter: 'isFile', flatten: true },
                    { expand: true, src: '../Deployment/*.js', dest: '../AbantechTestSite/Scripts/', filter: 'isFile', flatten: true },
                    { expand: true, src: '../Deployment/*.js', dest: '../NI3DPrototype/Scripts/', filter: 'isFile', flatten: true },
                    
                    { expand: true, src: '../Deployment/*.js', dest: '../Jenga/Scripts/', filter: 'isFile', flatten: true }
                ],
            },
            deploy: {
                files: [
                    //{ expand: true, src: './3D System Interface/ActionToFunctionMapping.js', dest: '../DemoWebApp/Scripts/', filter: 'isFile', flatten: true },
                    //{ expand: true, src: './public/SketchUp.js', dest: '../DemoWebApp/Scripts/', filter: 'isFile', flatten: true },
                    { expand: true, cwd: '../AbantechTestSite/', src: ['**', '!*.njsproj', '!server.js'], dest: '../AbantechSite/', flatten: false }
                ],
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.main %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['../Deployment/<%= pkg.name %>.js '],
                dest: '../Deployment/<%= pkg.name %>.min.js'
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['browserify', 'uglify', 'copy:test'],
                options: {
                    spawn: false,
                },
            },
        },
    });
    
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    // Default task(s).
    grunt.registerTask('deploy', ['copy:deploy']);
    
    grunt.registerTask('watchme', ['watch'])
};