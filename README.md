# grunt-sharp [![Build Status](https://img.shields.io/travis/unindented/grunt-sharp.svg)](http://travis-ci.org/unindented/grunt-sharp) [![Dependency Status](https://img.shields.io/gemnasium/unindented/grunt-sharp.svg)](https://gemnasium.com/unindented/grunt-sharp)

> Resize JPEG, PNG, WebP and TIFF images.


## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sharp --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sharp');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.2](https://github.com/gruntjs/grunt-contrib-copy/tree/grunt-0.3-stable).*


## Sharp task

_Run this task with the `grunt sharp` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### tasks
Type: `Array`

The list of tasks you want to run for an image. Each task is a set of transformations supported by [`sharp`](https://github.com/lovell/sharp#image-transformation-options).

If you only want to apply a single set of transformations, you can obviate the `tasks` option and describe the transformations directly in the `options` object.

#### rename
Type: `String`

The name of the resulting image. It can make use of placeholders such as `{base}`, `{ext}`, `{width}` and `{height}`.

### Usage

To transform all images in a folder using a single set of transformation:

```js
sharp: {
  rotated: {
    files: [{
      expand: true,
      cwd: 'src/images/',
      src: ['**/*.png'],
      dest: 'build/images/'
    }],
    options: {
      background: 'white',
      flatten: true,
      resize: [48, 48],
      rotate: 180
    }
  }
}
```

To apply multiple sets of transformations:

```js
sharp: {
  apple: {
    files: [{
      expand: true,
      cwd: 'src/images/',
      src: 'icon.png',
      dest: 'build/images/'
    }],
    options: {
      rename: 'apple-touch-icon-{width}x{height}.{ext}',
      tasks: [
        {resize: 76},
        {resize: 120, grayscale: true},
        {resize: 152, interpolateWith: 'nearest'}
      ]
    }
  }
}
```

This task supports all the file mapping format Grunt supports. Please read [Globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) and [Building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) for additional details.


## Meta

* Code: `git clone git://github.com/unindented/grunt-sharp.git`
* Home: <https://github.com/unindented/grunt-sharp/>


## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))


## License

Copyright (c) 2015 Daniel Perez Alvarez ([unindented.org](http://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
