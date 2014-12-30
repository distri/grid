(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "grid\n====\n\nA 2D Grid of values\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Grid\n====\n\nA 2D grid of values.\n\n      module.exports = Grid = (width, height, defaultValue) ->\n        generateValue = (x, y) ->\n          if typeof defaultValue is \"function\"\n            defaultValue(x, y)\n          else\n            defaultValue\n\n        grid =\n          [0...height].map (y) ->\n            [0...width].map (x) ->\n              generateValue(x, y)\n\n        self =\n          contract: (x, y) ->\n            height -= y\n            width -= x\n\n            grid.length = height\n\n            grid.forEach (row) ->\n              row.length = width\n\n            return self\n\n          copy: ->\n            Grid(width, height, self.get)\n\n          get: (x, y) ->\n            return if x < 0 or x >= width\n            return if y < 0 or y >= height\n\n            grid[y][x]\n\n          set: (x, y, value) ->\n            return if x < 0 or x >= width\n            return if y < 0 or y >= height\n\n            grid[y][x] = value\n\n          each: (iterator) ->\n            grid.forEach (row, y) ->\n              row.forEach (value, x) ->\n                iterator(value, x, y)\n\n            return self\n\nExpand the grid using the given `defaultValue` value or function to fill any\npositions that need to be filled.\n\n          expand: (x, y, defaultValue) ->\n            newRows = [0...y].map (y) ->\n              [0...width].map (x) ->\n                if typeof defaultValue is \"function\"\n                  defaultValue(x, y + height)\n                else\n                  defaultValue\n\n            grid = grid.concat newRows\n\n            grid = grid.map (row, y) ->\n              row.concat [0...x].map (x) ->\n                if typeof defaultValue is \"function\"\n                  defaultValue(width + x, y)\n                else\n                  defaultValue\n\n            height = y + height\n            width = x + width\n\n            return self\n\nReturn a 1-dimensional array of the data within the grid.\n\n          toArray: ->\n            grid.reduce (a, b) ->\n              a.concat(b)\n            , []\n\n        return self\n",
      "mode": "100644"
    },
    "test/grid.coffee": {
      "path": "test/grid.coffee",
      "content": "Grid = require \"../main\"\n\ndescribe \"Grid\", ->\n  it \"should resize\", ->\n    grid = Grid(32, 32, 0)\n\n    grid.expand(128 - 32, 72 - 32, 0)\n\n    called = 0\n    grid.each (value, x, y) ->\n      called += 1\n      assert.equal value, 0, \"(#{x}, #{y}) is 0\"\n\n    assert.equal called, 128 * 72, \"Called: #{called}, Expected: #{128 * 72}\"\n",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var Grid;\n\n  module.exports = Grid = function(width, height, defaultValue) {\n    var generateValue, grid, self, _i, _results;\n    generateValue = function(x, y) {\n      if (typeof defaultValue === \"function\") {\n        return defaultValue(x, y);\n      } else {\n        return defaultValue;\n      }\n    };\n    grid = (function() {\n      _results = [];\n      for (var _i = 0; 0 <= height ? _i < height : _i > height; 0 <= height ? _i++ : _i--){ _results.push(_i); }\n      return _results;\n    }).apply(this).map(function(y) {\n      var _i, _results;\n      return (function() {\n        _results = [];\n        for (var _i = 0; 0 <= width ? _i < width : _i > width; 0 <= width ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).map(function(x) {\n        return generateValue(x, y);\n      });\n    });\n    self = {\n      contract: function(x, y) {\n        height -= y;\n        width -= x;\n        grid.length = height;\n        grid.forEach(function(row) {\n          return row.length = width;\n        });\n        return self;\n      },\n      copy: function() {\n        return Grid(width, height, self.get);\n      },\n      get: function(x, y) {\n        if (x < 0 || x >= width) {\n          return;\n        }\n        if (y < 0 || y >= height) {\n          return;\n        }\n        return grid[y][x];\n      },\n      set: function(x, y, value) {\n        if (x < 0 || x >= width) {\n          return;\n        }\n        if (y < 0 || y >= height) {\n          return;\n        }\n        return grid[y][x] = value;\n      },\n      each: function(iterator) {\n        grid.forEach(function(row, y) {\n          return row.forEach(function(value, x) {\n            return iterator(value, x, y);\n          });\n        });\n        return self;\n      },\n      expand: function(x, y, defaultValue) {\n        var newRows, _j, _results1;\n        newRows = (function() {\n          _results1 = [];\n          for (var _j = 0; 0 <= y ? _j < y : _j > y; 0 <= y ? _j++ : _j--){ _results1.push(_j); }\n          return _results1;\n        }).apply(this).map(function(y) {\n          var _j, _results1;\n          return (function() {\n            _results1 = [];\n            for (var _j = 0; 0 <= width ? _j < width : _j > width; 0 <= width ? _j++ : _j--){ _results1.push(_j); }\n            return _results1;\n          }).apply(this).map(function(x) {\n            if (typeof defaultValue === \"function\") {\n              return defaultValue(x, y + height);\n            } else {\n              return defaultValue;\n            }\n          });\n        });\n        grid = grid.concat(newRows);\n        grid = grid.map(function(row, y) {\n          var _k, _results2;\n          return row.concat((function() {\n            _results2 = [];\n            for (var _k = 0; 0 <= x ? _k < x : _k > x; 0 <= x ? _k++ : _k--){ _results2.push(_k); }\n            return _results2;\n          }).apply(this).map(function(x) {\n            if (typeof defaultValue === \"function\") {\n              return defaultValue(width + x, y);\n            } else {\n              return defaultValue;\n            }\n          }));\n        });\n        height = y + height;\n        width = x + width;\n        return self;\n      },\n      toArray: function() {\n        return grid.reduce(function(a, b) {\n          return a.concat(b);\n        }, []);\n      }\n    };\n    return self;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "test/grid": {
      "path": "test/grid",
      "content": "(function() {\n  var Grid;\n\n  Grid = require(\"../main\");\n\n  describe(\"Grid\", function() {\n    return it(\"should resize\", function() {\n      var called, grid;\n      grid = Grid(32, 32, 0);\n      grid.expand(128 - 32, 72 - 32, 0);\n      called = 0;\n      grid.each(function(value, x, y) {\n        called += 1;\n        return assert.equal(value, 0, \"(\" + x + \", \" + y + \") is 0\");\n      });\n      return assert.equal(called, 128 * 72, \"Called: \" + called + \", Expected: \" + (128 * 72));\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\"};",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.1.0",
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/grid",
    "homepage": null,
    "description": "A 2D Grid of values",
    "html_url": "https://github.com/distri/grid",
    "url": "https://api.github.com/repos/distri/grid",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});