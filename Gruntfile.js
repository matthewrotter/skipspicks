module.exports = function(grunt) {

  var target = grunt.option('target') || 'local';

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
        files: ['<%= jshint.files %>', '!<%= servicedir %>/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify']
      },
      express: {
      files: ['sp-server.js', '<%= servicedir %>/**/*.js'],
        tasks: ['jshint', 'express:dev'],
        options: {
          spawn: false
        }
      },
      html: {
        files: ['<%= clientdir %>/www/**/*.html', '<%= clientdir %>/www/**/*.css'],
        tasks: ['copy']
      }
    },
    replace: {
      local: {
        src: [
          'client/src/config.js',
          'service/config.js'
        ],
        overwrite: true,
        replacements: [
          {
            from: /(HOST.?\*\/.?['"])([^'"]+)/g,
            to: '$1<%= pkg.replace.local.host %>'
          },
          {
            from: /(MONGO.?\*\/.?['"])([^'"]+)/g,
            to: '$1<%= pkg.replace.local.mongo %>'
          }
        ]
      },
      nodejitsu: {
        src: [
          'client/src/config.js',
          'service/config.js'
        ],
        overwrite: true,
        replacements: [
          {
            from: /(HOST.?\*\/.?['"])([^'"]+)/g,
            to: '$1<%= pkg.replace.nodejitsu.host %>'
          },
          {
            from: /(MONGO.?\*\/.?['"])([^'"]+)/g,
            to: '$1<%= pkg.replace.nodejitsu.mongo %>'
          }
        ]
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
  grunt.loadNpmTasks('grunt-text-replace');


  grunt.registerTask('test',  ['jshint']);
  grunt.registerTask('work',  ['jshint', 'build', 'express', 'watch']);
  grunt.registerTask('build', 
          ['replace:' + target, 'clean', 'concat', 'copy', 'uglify']);
  grunt.registerTask('default', ['work']);

  console.log('TARGET', target);

};
