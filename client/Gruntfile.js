module.exports = function(grunt) {

  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      minlibs: {
        src: [
          // 'vendor/jquery-2.0.3.min.js',
          'vendor/angular.min.js',
          'vendor/slideout.js',
          // 'vendor/bootstrap.min.js',
          'vendor/leaflet.min.js'
        ],
        dest: '<%= distdir %>/assets/js/vendor.min.js'
      },
      code: {
        src: [
          'src/app.js',
          'src/routes.js',
          'src/directives.js',
          'src/controllers.js'
        ],
        dest: '<%= distdir %>/assets/js/code.js'
      }
    },
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: [
          { dest: '<%= distdir %>/', src : '**', expand: true, cwd: 'www/' }
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= distdir %>/assets/js/code.min.js': ['<%= concat.code.src %>']
        }
      }
    },
    jshint: {
      files: [
        'Gruntfile.js', 
        'src/**/*.js', 
        'test/**/*.js'
      ],
      jshintrc: '.jshintrc'
    },
    watch: {
      scripts: {
        files: ['<%= jshint.files %>'],
        tasks: ['concat', 'uglify']
      },
      html: {
        files: ['www/**/*.html', 'www/**/*.css'],
        tasks: ['copy']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // NOTE: npm install phantomjs -g to work w/ PhantomJS

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('work', ['watch']);
  grunt.registerTask('build', ['clean', 'concat', 'copy', 'uglify']);
  grunt.registerTask('default', ['work']);

};
