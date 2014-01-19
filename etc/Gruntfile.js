/**
 * Example Grunt Hub
 *
 * Edit the hub.all.src to point to your Gruntfile locations.
 * Then run `grunt` or `grunt watch`.
 */
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    hub: {
      all: {
        options: {
          concurrent: 4
        },
        src: [
          '../client/Gruntfile.js',
          '../service/Gruntfile.js'
        ],
        tasks: ['work']
      }
    }
  });

  grunt.loadNpmTasks('grunt-hub');

  grunt.registerTask('default', ['hub']);
};
