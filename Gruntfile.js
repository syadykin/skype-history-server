/*jshint node:true */
'use strict';

var grunt = require('grunt'),
    async = require('async'),
    fs = require('fs'),
    format = require('util').format,
    extend = require('util')._extend,
    pkg = require('./package.json'),
    external = Object.keys(pkg.browser);

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-shipit');
grunt.loadNpmTasks('grunt-angular-templates');
grunt.loadNpmTasks('grunt-mongo-migrations');
grunt.loadNpmTasks('grunt-nodemon');

grunt.initConfig({
  nodemon:{
    dev: {
      script: 'server.js',
      options: {
        ext: 'js',
        cwd: __dirname,
        ignore: ['assets/**', 'public/**']
      }
    }
  },
  migrations: {
    path: __dirname + '/migrations',
    template: grunt.file.read(__dirname + '/migrations/_template.js'),
    mongo: process.env.MONGOHQ_URL || 'mongodb://localhost/skype-history',
    ext: 'js'
  },
  shipit: extend({
    options: {
      workspace: '/tmp/' + pkg.name,
      deployTo: '/var/skype/server',
      repositoryUrl: pkg.repository,
      ignores: ['.git', '.gitignore', 'README.md', 'node_modules', 'init.tmpl'],
      keepReleases: 5
    },
  }, pkg.deploy),
  jshint: {
    options: {
      extensions: 'js',
      ignores: [
        'lib/vendor/**'
      ]
    },
    all: [
      'Gruntfile.js',
      'app/controller/**',
      'app/io/**',
      'app/models/**',
      'app/models.js',
      'lib/**',
      'config/**',
      'assets/js/**'
    ]
  },
  less: {
    development: {
      options: {
        paths: ['assets/css', 'lib/vendor', 'node_modules'],
      },
      files: {
        'public/assets/app.css': 'assets/css/app.less'
      }
    },
    production: {
      options: {
        paths: ['assets/css', 'lib/vendor', 'node_modules'],
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
      src: ['assets/js/vendor.js'],
      dest: 'public/assets/vendor.js',
      options: {
        transform: ['browserify-shim', 'uglifyify'],
        require: external
      }
    },

    app: {
      src: ['assets/js/app.js', 'tmp/templates.js'],
      dest: 'public/assets/app.js',
      options: {
        transform: ['uglifyify'],
        external: external
      }
    },

    watch: {
      src: ['assets/js/*.js'],
      dest: 'public/assets/app.js',
      options: {
        external: external,
        watch: true
      }
    }
  },

  watchs: {
    less: {
      files: ['assets/css/*.less', 'assets/css/*.css'],
      tasks: ['less:development']
    }
  },
  ngtemplates: {
    app: {
      src: '**.html',
      dest: 'tmp/templates.js',
      cwd: 'assets/templates',
      options: {
        prefix: 't/',
        htmlmin: {
          collapseBooleanAttributes:      true,
          collapseWhitespace:             true,
          removeAttributeQuotes:          true,
          removeComments:                 true,
          removeEmptyAttributes:          true,
          removeRedundantAttributes:      true,
          removeScriptTypeAttributes:     true,
          removeStyleLinkTypeAttributes:  true
        }
      }
    }
  }
});

grunt.registerTask('post-fetch', function() {
  var done = this.async();
  fs.readFile('init.tmpl', {encoding: 'utf-8'}, function(err, template) {
    template = grunt.template.process(template, {data: { pkg: pkg }});
    fs.writeFile(grunt.shipit.config.workspace + '/init', template, {encoding: 'utf8'}, done);
  });
});

grunt.shipit.on('fetched', function() {
  grunt.task.run(['post-fetch']);
});

grunt.registerTask('post-update', function() {
  async.waterfall([
    grunt.shipit.remote.bind(grunt.shipit, format('cd %s && npm install && npm rebuild', grunt.shipit.releasePath)),
    grunt.shipit.remote.bind(grunt.shipit, format('sudo mv %s/init /etc/init/%s.conf', grunt.shipit.releasePath, pkg.name)),
    grunt.shipit.remote.bind(grunt.shipit, format('cd %s && grunt', grunt.shipit.releasePath))
  ], this.async());
});

grunt.shipit.on('updated', function () {
  grunt.task.run(['post-update']);
});

grunt.registerTask('post-publish', function() {
  async.waterfall([
    grunt.shipit.remote.bind(grunt.shipit, format('NODE_ENV=%s grunt migrate:all', grunt.shipit.stage)),
    grunt.shipit.remote.bind(grunt.shipit, format('sudo restart %s || sudo start %s', pkg.name, pkg.name))
  ], this.async());
});

grunt.shipit.on('published', function() {
  grunt.task.run(['post-publish']);
});

grunt.task.renameTask('watch', 'watchs');
grunt.registerTask('watch', [
  'browserify:vendor',
  'less:development',
  'browserify:watch',
  'watchs:less'
]);
grunt.registerTask('default', ['browserify:vendor', 'ngtemplates:app', 'browserify:app', 'less:production']);
