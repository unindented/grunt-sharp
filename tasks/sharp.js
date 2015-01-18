'use strict';

module.exports = function (grunt) {
  var _ = grunt.util._;
  var fs = require('fs');
  var path = require('path');
  var async = require('async');
  var chalk = require('chalk');
  var sharp = require('sharp');
  var tmp = require('tmp');

  grunt.registerMultiTask('sharp', 'Resize images.', function () {
    modifyImages(getImages(this.files), this.options(), this.async());
  });

  var getImages = function (files) {
    return _.reduce(files, function (memo, filePair) {
      var isExpandedPair = filePair.orig.expand || false;
      var isDirectory = (detectDestType(filePair.dest) === 'directory');

      var images = _.map(filePair.src, function (src) {
        var dest = (!isExpandedPair && isDirectory) ?
          unixifyPath(path.join(filePair.dest, src)) : filePair.dest;

        return {src: src, dest: dest};
      });

      return memo.concat(images);
    }, []);
  };

  var modifyImages = function (images, options, done) {
    var tasks = _.map(images, function (img) {
      return function (callback) {
        grunt.file.mkdir(path.dirname(img.dest));

        modifyImage(img.src, img.dest, options, callback);
      };
    });

    async.parallel(tasks, function (err, results) {
      if (err) {
        return done(new Error(err));
      }

      var total = results.reduce(function (memo, result) {
        return memo + result.length;
      }, 0);

      grunt.log.writeln('Generated ' +
        chalk.cyan(total.toString()) + (total === 1 ? ' image' : ' images'));

      done();
    });
  };

  var modifyImage = function (src, dest, options, done) {
    var tasks = _.map(options.tasks || [options], function (task) {
      return function (callback) {
        var image = sharp(src);
        _.map(task, function (args, op) {
          image[op].apply(image, [].concat(args));
        });

        writeImage(image, src, dest, options.rename, callback);
      };
    });

    async.parallel(tasks, function (err, result) {
      if (err) {
        return done(new Error(err));
      }

      done(null, result);
    });
  };

  var writeImage = function (image, src, dest, rename, callback) {
    var dir = path.dirname(dest);
    var ext = path.extname(dest);
    var base = path.basename(dest, ext);

    var finalDest = rename ? path.join(dir, rename) : dest;

    tmp.tmpName(function (err, tmpDest) {
      if (err) {
        return callback(err);
      }

      image.toFile(tmpDest, function (err, info) {
        if (err) {
          return callback(err);
        }

        finalDest = processDest(finalDest, _.extend({base: base, ext: ext.substr(1)}, info));

        fs.rename(tmpDest, finalDest, function (err) {
          if (err) {
            return callback(err);
          }

          grunt.verbose.writeln('Images: ' + chalk.cyan(src) + ' -> ' + chalk.cyan(finalDest));

          callback(null, info);
        });
      });
    });
  };

  var processDest = function (dest, data) {
    return dest.replace(/{([^{}]*)}/g,
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
