var grunt = require('grunt');

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-browserify');

grunt.initConfig({
  jshint: {
    options: {
      globals: [ 'jQuery' ]
    },
    all: [
      'Gruntfile.js',
      'app/**/*.js',
      'lib/**/*.js',
      'config/**/*.js',
      'assets/js/*.js'
    ]
  },
  less: {
    development: {
      options: {
        paths: ['assets/css', 'node_modules'],
      },
      files: {
        'public/assets/app.css': 'assets/css/app.less'
      }
    },
    production: {
      options: {
        paths: ['assets/css', 'node_modules'],
        compress: true,
        cleancss: true
      },
      files: {
        'public/assets/app.css': 'assets/css/app.less'
      }
    }
  },
  browserify: {
    vendor: {
      src: [],
      dest: 'public/assets/vendor.js',
      options: {
        transform: ['uglifyify'],
        require: ['jquery', 'angular', 'angular-bootstrap']
      }
    },

    app: {
      src: ['assets/js/*.js'],
      dest: 'public/assets/app.js',
      options: {
        transform: ['uglifyify'],
        external: ['jquery', 'angular', 'angular-bootstrap'],
      }
    },

    watch: {
      src: ['assets/js/*.js'],
      dest: 'public/assets/app.js',
      options: {
        external: ['jquery', 'angular', 'angular-bootstrap'],
        watch: true,
      }
    }
  },

  watchs: {
    less: {
      files: ['assets/css/*.less', 'assets/css/*.css'],
      tasks: ['less:development']
    }
  }
});

grunt.task.renameTask('watch', 'watchs');
grunt.registerTask('watch', [
  'browserify:vendor',
  'less:development',
  'browserify:watch',
  'watchs:less'
]);
grunt.registerTask('default', ['browserify:vendor', 'browserify:app', 'less:production']);
