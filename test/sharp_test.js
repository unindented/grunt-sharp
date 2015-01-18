'use strict';

var fs = require('fs');

var testExistence = function (test, expectations) {
  test.expect(expectations.length);

  expectations.forEach(function (expectation) {
    test.equal(fs.existsSync(expectation), true, expectation + ' should exist');
  });

  test.done();
};

exports.sharp = {
  main: function (test) {
    testExistence(test, [
      'tmp/copy_test_files/icon.png',
      'tmp/copy_test_files/icon-inv.png'
    ]);
  },
  rename: function (test) {
    testExistence(test, [
      'tmp/copy_test_files/icon-48x48.png',
      'tmp/copy_test_files/icon-32x32.png',
      'tmp/copy_test_files/icon-inv-48x48.png',
      'tmp/copy_test_files/icon-inv-32x32.png'
    ]);
  }
};
