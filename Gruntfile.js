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
          resize: [48, 48],
          rotate: 180
        }
      },
      rename: {
        files: files,
        options: {
          rename: '{base}-{width}x{height}.{ext}',
          tasks: [
            {resize: 48},
            {resize: 32}
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
