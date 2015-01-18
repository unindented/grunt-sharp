module.exports = function (grunt) {
  'use strict';

  var dirs = [
    'tmp'
  ];
  var files = [{
    expand: true,
    cwd: 'test/fixtures/',
    src: ['**/*.png'],
    dest: 'tmp/copy_test_files/'
  }];

  // Project configuration.
  grunt.initConfig({
    clean: {
      test: dirs
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    sharp: {
      main: {
        files: files,
        options: {
          background: 'white',
          flatten: true,
          resize: [32, 32],
          rotate: 180
        }
      },
      rename: {
        files: files,
        options: {
          tasks: [
            {resize: 32, rename: '{base}-32x32.{ext}'},
            {resize: 32, rename: '{base}-16x16@2x.{ext}'},
            {resize: 16, rename: '{base}-16x16.{ext}'}
          ]
        }
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'jshint', 'sharp', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);
};
