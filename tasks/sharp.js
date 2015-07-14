'use strict';

module.exports = function (grunt) {
  var _ = grunt.util._;
  var path = require('path');
  var async = require('async');
  var chalk = require('chalk');
  var sharp = require('sharp');

  grunt.registerMultiTask('sharp', 'Resize images.', function () {
    modifyImages(getImages(this.files), this.options(), this.async());
  });

  var getImages = function (files) {
    return _.reduce(files, function (memo, filePair) {
      var isExpandedPair = !!filePair.orig.expand;
      var isExtDotLast = (filePair.orig.extDot === 'last');
      var isDirectory = (detectDestType(filePair.dest) === 'directory');

      var extDot = {
        first: /.*?(\.[^\/]*)$/,
        last: /.*?(\.[^\/\.]*)$/
      };

      var images = _.map(filePair.src, function (src) {
        var ext = src.replace(isExtDotLast ? extDot.last : extDot.first, '$1');
        var dest = (!isExpandedPair && isDirectory) ?
          unixifyPath(path.join(filePair.dest, src)) : filePair.dest;

        return {src: src, ext: ext, dest: dest};
      });

      return memo.concat(images);
    }, []);
  };

  var modifyImages = function (images, options, done) {
    var tasks = _.map(images, function (image) {
      return function (callback) {
        modifyImage(image, options, callback);
      };
    });

    async.parallel(tasks, function (err, results) {
      if (err) {
        return done(new Error(err));
      }

      var total = results.reduce(function (memo, result) {
        return memo + result.length;
      }, 0);

      grunt.log.ok('Generated ' +
        chalk.cyan(total.toString()) + (total === 1 ? ' image' : ' images'));

      done();
    });
  };

  var modifyImage = function (image, options, done) {
    var tasks = _.map(options.tasks || [options], function (task) {
      return function (callback) {
        var data = sharp(image.src);
        _.map(task, function (args, op) {
          if (data[op]) {
            data[op].apply(data, [].concat(args));
          }
          else if (op !== 'rename') {
            grunt.log.warn('Skipping unknown operation: ' + op);
          }
        });

        writeImage(data, image, task.rename, callback);
      };
    });

    async.parallel(tasks, function (err, result) {
      if (err) {
        return done(new Error(err));
      }

      done(null, result);
    });
  };

  var writeImage = function (data, image, rename, callback) {
    var src = image.src;
    var ext = image.ext;
    var dest = image.dest;
    var dir = path.dirname(dest);
    var base = path.basename(dest, ext);

    grunt.file.mkdir(dir);

    dest = rename ? path.join(dir, processName(rename, {base: base, ext: ext.substr(1)})) : dest;

    data.toFile(dest, function (err, info) {
      if (err) {
        return callback(err);
      }

      grunt.verbose.writeln('Images: ' + chalk.cyan(src) + ' -> ' + chalk.cyan(dest));

      callback(null, info);
    });
  };

  var processName = function (name, data) {
    return name.replace(/{([^{}]*)}/g,
      function (a, b) {
        var r = data[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  };

  var detectDestType = function (dest) {
    return _.endsWith(dest, '/') ? 'directory' : 'file';
  };

  var unixifyPath = function (filepath) {
    return (process.platform === 'win32') ? filepath.replace(/\\/g, '/') : filepath;
  };
};
