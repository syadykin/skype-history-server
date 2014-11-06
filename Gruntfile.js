var grunt = require('grunt'),
    async = require('async'),
    fs = require('fs'),
    format = require('util').format,
    extend = require('util')._extend,
    pkg = require('./package.json'),
    deploy = {}, env,
    depMapper = function(s) { return pkg.deploy[env].user + '@' + s; };

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-shipit');

for (var env in pkg.deploy) {
  deploy[env] = {servers: pkg.deploy[env].servers.map(depMapper)};
}

grunt.initConfig({
  shipit: extend({
    options: {
      workspace: '/tmp/skype-history-server',
      deployTo: '/var/skype/server',
      repositoryUrl: pkg.repository,
      ignores: ['.git', '.gitignore', 'README.md', 'node_modules', 'init.tmpl'],
      keepReleases: 5
    },
  }, deploy),
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
    grunt.shipit.remote.bind(grunt.shipit, format('cd %s && grunt browserify:vendor browserify:app less', grunt.shipit.releasePath))
  ], this.async());
});

grunt.shipit.on('updated', function () {
  grunt.task.run(['post-update']);
});

grunt.registerTask('post-publish', function() {
  grunt.shipit.remote(format('sudo restart %s || sudo start %s', pkg.name, pkg.name), this.async());
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
grunt.registerTask('default', ['browserify:vendor', 'browserify:app', 'less:production']);
