module.exports = function(grunt) {

  grunt.initConfig({
    clientdir: 'client',
    servicedir: 'service',
    distdir: '<%= clientdir %>/dist',
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      minlibs: {
        src: [
          '<%= clientdir %>/vendor/underscore.min.js',
          '<%= clientdir %>/vendor/angular.min.js',
          // '<%= clientdir %>/vendor/angular-route.min.js',
          '<%= clientdir %>/vendor/leaflet.min.js',
          '<%= clientdir %>/vendor/ng-tags-input.min.js'
        ],
        dest: '<%= distdir %>/assets/js/vendor.min.js'
      },
      code: {
        src: [
          '<%= clientdir %>/src/lib.js',
          '<%= clientdir %>/src/config.js',
          '<%= clientdir %>/src/app.js',
          // '<%= clientdir %>/src/routes.js',
          '<%= clientdir %>/src/directives.js',
          '<%= clientdir %>/src/services.js',
          '<%= clientdir %>/src/controllers.js',
          '<%= clientdir %>/src/slideout.js'
        ],
        dest: '<%= distdir %>/assets/js/code.js'
      }
    },
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: [
          { dest: '<%= distdir %>/', src: '**', expand: true, cwd: '<%= clientdir %>/www/' }
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
        '<%= clientdir %>/src/**/*.js',
        '<%= servicedir %>/**/*.js',
        '*/test/**/*.js'
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
          script: 'sp-server.js'
        }
      }
    },
    watch: {
      scripts: {
        files: ['<%= jshint.files %>', '!<%= servicedir %>'],
        tasks: ['jshint', 'concat', 'uglify']
      },
      express: {
      files: ['<%= servicedir %>/**/*.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      },
      html: {
        files: ['<%= clientdir %>/www/**/*.html', '<%= clientdir %>/www/**/*.css'],
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
  grunt.loadNpmTasks('grunt-express-server');


  // NOTE: npm install phantomjs -g to work w/ PhantomJS

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('work', ['jshint', 'build', 'express', 'watch']);
  grunt.registerTask('build', ['clean', 'concat', 'copy', 'uglify']);
  grunt.registerTask('default', ['work']);

};
