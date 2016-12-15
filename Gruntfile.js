module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' */\n',
        // Task configuration
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['dist/timestamp-plus.js', 'lib/selectize.min.js'],
                dest: 'dist/timestamp-plus.js'
            }
        },

        cssmin: {
          target: {
            files: {
              'dist/style.css': ['css/style.css']
            }
          }
        },

        browserify: {
            dist: {
                src: ['lib/timestamp-plus.js'],
                dest: 'dist/timestamp-plus.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/timestamp-plus.min.js'
            }
        },

        watch: {
            lib_test: {
                files: ['lib/**/*.js', 'test/**/*.js'],
                tasks: ['browserify','concat','cssmin', 'uglify']
            }
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-browserify');

    // Default task
    grunt.registerTask('default', [ 'browserify','concat',  'cssmin', 'uglify']);
};

