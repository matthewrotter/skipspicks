module.exports = function(grunt) {

  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'Gruntfile.js', 
        '**/*.js', 
        '!node_modules/**/*.js',
        'test/**/*.js'
      ],
      options: {
        laxcomma: true
      }
    },
    express: {
      options: {
        background: true
      },
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint'],
      express: {
      files: ['<%= jshint.files %>'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('work', ['express:dev', 'watch']);

};
