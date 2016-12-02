(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sureJs"] = factory();
	else
		root["sureJs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _chalk = __webpack_require__(1);
	
	var _chalk2 = _interopRequireDefault(_chalk);
	
	var _parse = __webpack_require__(11);
	
	var _lexer = __webpack_require__(13);
	
	var _lodash = __webpack_require__(14);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _lodash3 = __webpack_require__(15);
	
	var _lodash4 = _interopRequireDefault(_lodash3);
	
	var _lodash5 = __webpack_require__(16);
	
	var _lodash6 = _interopRequireDefault(_lodash5);
	
	var _lodash7 = __webpack_require__(17);
	
	var _lodash8 = _interopRequireDefault(_lodash7);
	
	var _utils = __webpack_require__(12);
	
	var _string = __webpack_require__(18);
	
	var _string2 = _interopRequireDefault(_string);
	
	var _number = __webpack_require__(19);
	
	var _number2 = _interopRequireDefault(_number);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SureJS = function () {
		function SureJS() {
			_classCallCheck(this, SureJS);
	
			this.namespaces = {};
			this.validators = [_string2.default, _number2.default];
		}
	
		_createClass(SureJS, [{
			key: "registerValidator",
			value: function registerValidator(validator) {
				this.validators.push(validator);
			}
		}, {
			key: "getNamespaces",
			value: function getNamespaces() {
				return Object.keys(this.namespaces);
			}
		}, {
			key: "getSchema",
			value: function getSchema(namespaceName, schemaName, filter) {
				var _this = this;
	
				if (this.namespaces[namespaceName] == null) {
					throw new Error("Can not find namespace " + namespaceName);
				}
	
				if (this.namespaces[namespaceName][schemaName] == null) {
					throw new Error("Can not find schema " + schemaName + " in  " + namespaceName);
				}
	
				var finalRules = {};
				var schema = this.namespaces[namespaceName][schemaName];
	
				// add rules of current schema
	
				for (var i = 0; i < schema.includes.length; i++) {
					var include = schema.includes[i];
	
					var rules = this.getSchema(include.namespace, include.schema, include.include);
	
					(0, _utils.iterateObject)(rules, function (property, rule) {
						finalRules[property] = rule;
					});
				}
	
				// Add rules of current schema
	
	
				(0, _utils.iterateObject)(schema.rules, function (key, value) {
	
					if (value.type == "itemLink") {
						value = _this.getSchema(value.parameters.namespace, value.parameters.schema)[value.parameters.item];
					}
	
					finalRules[key] = value;
				});
	
				if (filter != null && filter.length != 0) {
	
					// Only include values that are present in the filter array.
					return (0, _utils.filterObject)(finalRules, function (key, value) {
						return filter.indexOf(key) != -1;
					});
				}
	
				return finalRules;
			}
		}, {
			key: "typesMatch",
			value: function typesMatch(item, type) {
				var allowNull = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
				if (item == null && allowNull) {
					return true;
				}
				switch (type) {
	
					case "string":
	
						return (0, _lodash8.default)(item);
	
					case "number":
	
						return (0, _lodash4.default)(item);
	
					case "boolean":
	
						return (0, _lodash6.default)(item);
	
					case "array":
	
						return Array.isArray(item);
	
					case "object":
	
						return (0, _lodash2.default)(item);
	
					default:
						return false;
	
				}
			}
		}, {
			key: "validate",
			value: function validate(namespaceName, schemaName, item, callback) {
				var _this2 = this;
	
				try {
					(function () {
	
						var rules = _this2.getSchema(namespaceName, schemaName);
	
						// Start iterating the rules
	
						// Check links
	
						var finalResult = {};
	
						(0, _utils.processObject)(rules, function (key, value, processedRule) {
	
							if (value.type == "link") {
	
								if (_this2.typesMatch(item[key], "object", value.nullable)) {
									_this2.validate(value.parameters.namespace, value.parameters.schema, item[key], function (err, result) {
	
										if (err != null) {
											processedRule(err);
										} else {
											finalResult[key] = result;
											processedRule();
										}
									});
								} else {
									processedRule({
										error: "invalidType",
										namespace: namespaceName,
										schema: schemaName,
										key: key,
										expected: value.type,
										got: item[key]
									});
								}
							} else {
	
								if (value.array) {
									(function () {
										var resultArray = [];
										(0, _utils.processArray)(item[key], function (arrayItem, done) {
	
											if (_this2.typesMatch(arrayItem, value.type, value.nullable)) {
	
												_this2.validateItem(arrayItem, value.parameters, value.type, item, function (err, result) {
													if (err != null) {
														done({
															err: err,
															namespace: namespaceName,
															schema: schemaName, key: key,
															item: arrayItem
														});
													} else {
														resultArray[key] = result;
														done();
													}
												});
											} else {
												done({
													error: "invalidType",
													namespace: namespaceName,
													schema: schemaName,
													key: key,
													expected: value.type,
													got: arrayItem
												});
											}
										}, function (err) {
	
											if (err != null) {
												processedRule(err);
											} else {
												finalResult[key] = resultArray;
											}
										});
									})();
								} else {
									if (_this2.typesMatch(item[key], value.type, value.nullable)) {
	
										_this2.validateItem(item[key], value.parameters, value.type, item, function (err, result) {
											if (err != null) {
												processedRule({
													err: err,
													namespace: namespaceName,
													schema: schemaName, key: key
												});
											} else {
												finalResult[key] = result;
												processedRule();
											}
										});
									} else {
										processedRule({
											error: "invalidType",
											namespace: namespaceName,
											schema: schemaName,
											key: key,
											expected: value.type,
											got: item[key]
										});
									}
								}
							}
						}, function (err) {
							if (err != null) {
								callback(err, null);
							} else {
								callback(null, finalResult);
							}
						});
					})();
				} catch (e) {
					throw e;
					callback(e, null);
				}
			}
		}, {
			key: "validateItem",
			value: function validateItem(item, parameters, type, object, callback) {
				var _this3 = this;
	
				if (item == null) {
					type = type + "Null";
				}
	
				(0, _utils.processObject)(parameters, function (parameter, value, processedParameter) {
					(0, _utils.processArray)(_this3.validators, function (validator, processedValidator) {
	
						if (validator[parameter] != null && validator[parameter].itemTypes.indexOf(type) != -1) {
	
							validator[parameter].validate(item, value, function (err, result) {
	
								if (err != null) {
									processedValidator(err);
								} else {
									item = result;
									processedValidator();
								}
							}, { store: _this3, parameters: parameters });
						} else {
							processedValidator();
						}
					}, function (err) {
						processedParameter(err);
					});
				}, function (err) {
					if (err != null) {
						callback(err, null);
					} else {
						callback(null, item);
					}
				});
			}
		}, {
			key: "parseSchema",
			value: function parseSchema(schema, meta) {
				var _this4 = this;
	
				var tree = (0, _parse.parse)((0, _lexer.lex)(schema));
	
				(0, _utils.iterateObject)(tree.namespaces, function (namespaceName, namespace) {
	
					(0, _utils.iterateObject)(namespace.schemas, function (schemaName, schema) {
	
						// Check if this schema is already registered
						if (_this4.namespaces[namespaceName] != null && _this4.namespaces[namespaceName][schemaName] != null) {
							throw new Error(_chalk2.default.red("Can not register schema " + schemaName + "  in namespace " + namespaceName + " twice "));
						}
	
						// Create a namespace if it doesn't exist
						if (_this4.namespaces[namespaceName] == null) {
							_this4.namespaces[namespaceName] = {};
						}
	
						// Store the schema
	
						_this4.namespaces[namespaceName][schemaName] = schema;
					});
				});
			}
		}, {
			key: "registerValidator",
			value: function registerValidator(validator) {
				this.validators.push(validator);
			}
		}]);
	
		return SureJS;
	}();
	
	exports.default = SureJS;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var escapeStringRegexp = __webpack_require__(3);
	var ansiStyles = __webpack_require__(4);
	var stripAnsi = __webpack_require__(6);
	var hasAnsi = __webpack_require__(8);
	var supportsColor = __webpack_require__(10);
	var defineProps = Object.defineProperties;
	var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);
	
	function Chalk(options) {
		// detect mode if not set manually
		this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
	}
	
	// use bright blue on Windows as the normal blue color is illegible
	if (isSimpleWindowsTerm) {
		ansiStyles.blue.open = '\u001b[94m';
	}
	
	var styles = (function () {
		var ret = {};
	
		Object.keys(ansiStyles).forEach(function (key) {
			ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
	
			ret[key] = {
				get: function () {
					return build.call(this, this._styles.concat(key));
				}
			};
		});
	
		return ret;
	})();
	
	var proto = defineProps(function chalk() {}, styles);
	
	function build(_styles) {
		var builder = function () {
			return applyStyle.apply(builder, arguments);
		};
	
		builder._styles = _styles;
		builder.enabled = this.enabled;
		// __proto__ is used because we must return a function, but there is
		// no way to create a function with a different prototype.
		/* eslint-disable no-proto */
		builder.__proto__ = proto;
	
		return builder;
	}
	
	function applyStyle() {
		// support varags, but simply cast to string in case there's only one arg
		var args = arguments;
		var argsLen = args.length;
		var str = argsLen !== 0 && String(arguments[0]);
	
		if (argsLen > 1) {
			// don't slice `arguments`, it prevents v8 optimizations
			for (var a = 1; a < argsLen; a++) {
				str += ' ' + args[a];
			}
		}
	
		if (!this.enabled || !str) {
			return str;
		}
	
		var nestedStyles = this._styles;
		var i = nestedStyles.length;
	
		// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
		// see https://github.com/chalk/chalk/issues/58
		// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
		var originalDim = ansiStyles.dim.open;
		if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
			ansiStyles.dim.open = '';
		}
	
		while (i--) {
			var code = ansiStyles[nestedStyles[i]];
	
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			str = code.open + str.replace(code.closeRe, code.open) + code.close;
		}
	
		// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
		ansiStyles.dim.open = originalDim;
	
		return str;
	}
	
	function init() {
		var ret = {};
	
		Object.keys(styles).forEach(function (name) {
			ret[name] = {
				get: function () {
					return build.call(this, [name]);
				}
			};
		});
	
		return ret;
	}
	
	defineProps(Chalk.prototype, init());
	
	module.exports = new Chalk();
	module.exports.styles = ansiStyles;
	module.exports.hasColor = hasAnsi;
	module.exports.stripColor = stripAnsi;
	module.exports.supportsColor = supportsColor;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
	
	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}
	
		return str.replace(matchOperatorsRe, '\\$&');
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';
	
	function assembleStyles () {
		var styles = {
			modifiers: {
				reset: [0, 0],
				bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
				dim: [2, 22],
				italic: [3, 23],
				underline: [4, 24],
				inverse: [7, 27],
				hidden: [8, 28],
				strikethrough: [9, 29]
			},
			colors: {
				black: [30, 39],
				red: [31, 39],
				green: [32, 39],
				yellow: [33, 39],
				blue: [34, 39],
				magenta: [35, 39],
				cyan: [36, 39],
				white: [37, 39],
				gray: [90, 39]
			},
			bgColors: {
				bgBlack: [40, 49],
				bgRed: [41, 49],
				bgGreen: [42, 49],
				bgYellow: [43, 49],
				bgBlue: [44, 49],
				bgMagenta: [45, 49],
				bgCyan: [46, 49],
				bgWhite: [47, 49]
			}
		};
	
		// fix humans
		styles.colors.grey = styles.colors.gray;
	
		Object.keys(styles).forEach(function (groupName) {
			var group = styles[groupName];
	
			Object.keys(group).forEach(function (styleName) {
				var style = group[styleName];
	
				styles[styleName] = group[styleName] = {
					open: '\u001b[' + style[0] + 'm',
					close: '\u001b[' + style[1] + 'm'
				};
			});
	
			Object.defineProperty(styles, groupName, {
				value: group,
				enumerable: false
			});
		});
	
		return styles;
	}
	
	Object.defineProperty(module, 'exports', {
		enumerable: true,
		get: assembleStyles
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(7)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(9);
	var re = new RegExp(ansiRegex().source); // remove the `g` flag
	module.exports = re.test.bind(re);


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var argv = process.argv;
	
	var terminator = argv.indexOf('--');
	var hasFlag = function (flag) {
		flag = '--' + flag;
		var pos = argv.indexOf(flag);
		return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
	};
	
	module.exports = (function () {
		if ('FORCE_COLOR' in process.env) {
			return true;
		}
	
		if (hasFlag('no-color') ||
			hasFlag('no-colors') ||
			hasFlag('color=false')) {
			return false;
		}
	
		if (hasFlag('color') ||
			hasFlag('colors') ||
			hasFlag('color=true') ||
			hasFlag('color=always')) {
			return true;
		}
	
		if (process.stdout && !process.stdout.isTTY) {
			return false;
		}
	
		if (process.platform === 'win32') {
			return true;
		}
	
		if ('COLORTERM' in process.env) {
			return true;
		}
	
		if (process.env.TERM === 'dumb') {
			return false;
		}
	
		if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
			return true;
		}
	
		return false;
	})();
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parse = parse;
	
	var _chalk = __webpack_require__(1);
	
	var _chalk2 = _interopRequireDefault(_chalk);
	
	var _utils = __webpack_require__(12);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var defaultIgnores = ["comment", "newLine", "space", "indent"];
	
	function getType(type) {
	
	    var aliases = {
	        str: "string",
	        nr: "number",
	        b: "boolean"
	    };
	
	    if (aliases[type] != null) {
	        return aliases[type];
	    }
	
	    return type;
	}
	
	function parse(tokens) {
	
	    var result = {
	        namespaces: {}
	    };
	
	    var modes = {
	
	        "findNamespaceBegin": {
	            expect: {
	                "findNamespaceOpen": ["word"]
	            }
	        },
	        "findNamespaceOpen": {
	            expect: {
	                "findNamespaceContent": ["curlyOpen"]
	            }
	        },
	        "findNamespaceContent": {
	            expect: {
	                "findSchemaBegin": ["hashtag"],
	                "findNamespaceBegin": ["curlyClose"]
	            }
	        },
	        "findSchemaBegin": {
	            expect: {
	                "findSchemaName": ["word"]
	            }
	        },
	        "findSchemaName": {
	            expect: {
	                "findSchemaOpen": ["curlyOpen"]
	            }
	        },
	        "findSchemaOpen": {
	            expect: {
	                "findIncludeName": ["include"],
	                "findItemName": ["word"],
	                "findItemNullableMarker": ["questionMark"],
	                "findNamespaceContent": ["curlyClose"]
	            }
	        },
	
	        "findIncludeName": {
	            expect: {
	                "findIncludeName": ["word", "dot"],
	                "findIncludedValues": ["curlyOpen"],
	                "findSchemaOpen": ["newLine"]
	            },
	            ignore: ["comment", "space", "indent"]
	        },
	        "findIncludedValues": {
	            expect: {
	                "findSchemaOpen": ["curlyClose"],
	                "findIncludedValues": ["word", "comma"]
	            }
	        },
	
	        "findItemNullableMarker": {
	            expect: {
	                "findItemName": ["word"]
	            }
	        },
	
	        "findItemName": {
	            expect: {
	                "findItemSeperator": ["colon"]
	            }
	        },
	        "findItemSeperator": {
	            expect: {
	                "findItemType": ["word"],
	                "findItemLink": ["gT"],
	                "findSchemaOpen": ["newLine"],
	                "findSchemaLink": ["atSign"]
	            },
	            ignore: ["space", "indent", "comment"]
	        },
	
	        "findItemType": {
	            expect: {
	                "findParameterOpen": ["braceOpen"],
	                "findSchemaOpen": ["newLine"],
	                "findArrayStart": ["bracketOpen"]
	            },
	            ignore: ["comment", "indent", "space"]
	        },
	        "findItemLink": {
	            expect: {
	                "findItemLink": ["word"],
	                "findItemLinkSeperator": ["dot"],
	                "findArrayStart": ["braceOpen"],
	                "findSchemaOpen": ["newLine"]
	            }
	        },
	
	        "findItemLinkSeperator": {
	            expect: {
	                "findItemLink": ["word"]
	            }
	        },
	
	        "findArrayStart": {
	            expect: {
	                "findItemType": ["bracketClose"],
	                "findArrayParameterName": ["word"]
	            }
	        },
	        "findArrayParameterName": {
	            expect: {
	                "findArrayParameterSeperator": ["equals"]
	            }
	        },
	        "findArrayParameterSeperator": {
	            expect: {
	                "findArrayParameterValue": ["string", "number", "boolean"]
	            }
	        },
	        "findArrayParameterValue": {
	            expect: {
	                "findArrayStart": ["comma"],
	                "findItemType": ["bracketClose"]
	            }
	        },
	
	        "findParameterOpen": {
	            expect: {
	                "findParameterName": ["word"],
	                "findSchemaOpen": ["braceClose"]
	            }
	        },
	        "findParameterName": {
	            expect: {
	                "findParameterSeperator": ["equals"]
	            }
	        },
	        "findParameterSeperator": {
	            expect: {
	                "findParameterValue": ["boolean", "number", "string"]
	            }
	        },
	        "findParameterValue": {
	            expect: {
	                "findParameterOpen": ["comma"],
	                "findSchemaOpen": ["braceClose"]
	            }
	        },
	
	        "findSchemaLink": {
	            expect: {
	                "findSchemaLink": ["dot", "word"],
	                "findSchemaLinkArrayStart": ["bracketOpen"],
	                "findSchemaOpen": ["newLine"]
	            },
	            ignore: ["comment", "indent", "space"]
	        },
	
	        "findSchemaLinkArrayStart": {
	            expect: {
	                "findSchemaOpen": ["bracketClose"],
	                "findItemLinkArrayParameterName ": ["word"]
	            }
	        },
	        "findItemLinkArrayParameterName ": {
	            expect: {
	                "findItemLinkArrayParameterSeperator": ["equals"]
	            }
	        },
	        "findItemLinkArrayParameterSeperator": {
	            expect: {
	                "findItemLinkArrayParameterValue": ["boolean", "number", "string"]
	            }
	        },
	        "findItemLinkArrayParameterValue": {
	            expect: {
	                "findSchemaLinkArrayStart": ["comma"],
	                "findSchemaOpen": ["bracketClose"]
	            }
	        }
	    };
	
	    var currentNamespace = void 0;
	    var currentSchema = void 0;
	    var currentItemName = void 0;
	    var currentParameter = void 0;
	
	    var currentInclude = [];
	    var currentIncludedValues = [];
	
	    var currentLink = [];
	
	    var currentItemLink = [];
	
	    var isNullable = false;
	
	    var isArray = false;
	    var currentArrayParameter = void 0;
	
	    var listeners = {
	
	        findItemNullableMarker: {
	            questionMark: function questionMark(token) {
	                isNullable = true;
	            }
	        },
	
	        findSchemaLink: {
	
	            word: function word(token) {
	                if (currentLink.length == 2) {
	                    throw new Error("A link has to declare two values at max. Use Syntax: @Namespace.Schema or @Schema !");
	                }
	
	                currentLink.push(token.value);
	            }
	
	        },
	
	        findArrayStart: {
	            bracketOpen: function bracketOpen(token) {
	                if (isArray) {
	                    throw new Error("Can not declare value as array twice.");
	                }
	                isArray = true;
	            }
	        },
	
	        findNamespaceOpen: {
	
	            word: function word(token) {
	                currentNamespace = token.value;
	                if (result.namespaces[token.value] != null) {
	                    throw new Error("Unable to declare namespace " + token.value + ". It is already defined!");
	                }
	                result.namespaces[token.value] = {
	                    schemas: {}
	                };
	            }
	        },
	
	        findSchemaOpen: {
	            any: function any(token) {
	                if (currentInclude.length != 0) {
	                    result.namespaces[currentNamespace].schemas[currentSchema].includes.push({
	                        namespace: currentInclude.length == 2 ? currentInclude[0] : currentNamespace,
	                        schema: currentInclude.length == 2 ? currentInclude[1] : currentInclude[0],
	                        include: currentIncludedValues
	                    });
	
	                    currentInclude = [];
	                    currentIncludedValues = [];
	                }
	
	                if (currentLink.length != 0) {
	
	                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].type = "link";
	                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters = {
	                        namespace: currentLink.length == 2 ? currentLink[0] : currentNamespace,
	                        schema: currentLink.length == 2 ? currentLink[1] : currentLink[0]
	                    };
	
	                    currentLink = [];
	                }
	
	                if (currentItemLink.length != 0) {
	
	                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].type = "itemLink";
	
	                    if (currentItemLink.length == 1) {
	                        currentItemLink.unshift(currentSchema);
	                    }
	
	                    if (currentItemLink.length == 2) {
	                        currentItemLink.unshift(currentNamespace);
	                    }
	
	                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters = {
	                        namespace: currentItemLink[0],
	                        schema: currentItemLink[1],
	                        item: currentItemLink[2]
	                    };
	
	                    currentItemLink = [];
	                }
	            }
	        },
	
	        findSchemaName: {
	
	            word: function word(token) {
	                currentSchema = token.value;
	                if (result.namespaces[currentNamespace].schemas[token.value] != null) {
	                    throw new Error("Unable to declare schema " + token.value + ". It is already defined!");
	                }
	
	                result.namespaces[currentNamespace].schemas[token.value] = {
	                    rules: {},
	                    includes: []
	                };
	            }
	        },
	
	        findItemLink: {
	            word: function word(token) {
	
	                if (currentItemLink.length == 3) {
	                    throw new Error("An item-link has to declare three values at max. Use Syntax: >Schema.item or ...Namespace.Schema.item !");
	                }
	                currentItemLink.push(token.value);
	            }
	        },
	        findItemName: {
	            word: function word(token) {
	
	                if (result.namespaces[currentNamespace].schemas[currentSchema].rules[token.value] != null) {
	                    throw new Error("Unable to declare schema " + token.value + ". It is already defined!");
	                }
	
	                currentItemName = token.value;
	
	                result.namespaces[currentNamespace].schemas[currentSchema].rules[token.value] = {
	                    parameters: {},
	                    type: null,
	                    array: false,
	                    nullable: isNullable,
	                    arrayParameters: {}
	                };
	
	                isNullable = false;
	            }
	        },
	
	        findItemType: {
	            word: function word(token) {
	
	                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].type = getType(token.value);
	            },
	            bracketClose: function bracketClose(token) {
	                if (isArray) {
	                    result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].array = true;
	
	                    isArray = false;
	                    currentArrayParameter = null;
	                }
	            }
	        },
	
	        findItemLinkArrayParameterName: {
	
	            word: function word(token) {
	
	                currentArrayParameter = token.value;
	            }
	
	        },
	        findItemLinkArrayParameterValue: {
	
	            any: function any(token) {
	
	                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].arrayParameters[currentArrayParameter] = token.value;
	            }
	
	        },
	
	        findArrayParameterName: {
	
	            word: function word(token) {
	
	                currentArrayParameter = token.value;
	            }
	
	        },
	        findArrayParameterValue: {
	
	            any: function any(token) {
	
	                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].arrayParameters[currentArrayParameter] = token.value;
	            }
	
	        },
	
	        findParameterValue: {
	
	            any: function any(token) {
	                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters[currentParameter] = token.value;
	            }
	
	        },
	        findParameterName: {
	            word: function word(token) {
	
	                if (result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].parameters[token.value] != null) {
	
	                    throw new Error("Unable to declare parameter " + token.value + ". It is already defined!");
	                }
	
	                currentParameter = token.value;
	            }
	        },
	        findIncludeName: {
	            word: function word(token) {
	
	                if (currentInclude.length == 2) {
	                    throw new Error("An include has to declare two values at max. Use Syntax: ...Namespace.Schema or ...Schema !");
	                }
	                currentInclude.push(token.value);
	            }
	
	        },
	        findIncludedValues: {
	            word: function word(token) {
	                currentIncludedValues.push(token.value.trim());
	            }
	        },
	        findSchemaLinkArrayStart: {
	            bracketOpen: function bracketOpen(token) {
	                result.namespaces[currentNamespace].schemas[currentSchema].rules[currentItemName].array = true;
	            }
	        }
	
	    };
	
	    var currentMode = "findNamespaceBegin";
	
	    for (var i = 0; i < tokens.length; i++) {
	
	        var token = tokens[i];
	
	        if (modes[currentMode] != null) {
	
	            var mode = modes[currentMode];
	
	            var found = false;
	
	            var options = mode.expect;
	
	            var nextModes = Object.keys(options);
	
	            for (var _i = 0; _i < nextModes.length; _i++) {
	
	                var expectedTokens = options[nextModes[_i]];
	
	                if (expectedTokens.indexOf(token.type) != -1) {
	                    // Found the next mode
	
	
	                    currentMode = nextModes[_i];
	
	                    if (listeners[currentMode] != null) {
	                        if (listeners[currentMode][token.type] != null) {
	                            listeners[currentMode][token.type](token);
	                        }
	
	                        if (listeners[currentMode].any != null) {
	                            listeners[currentMode].any(token);
	                        }
	                    }
	
	                    found = true;
	
	                    break;
	                }
	            }
	
	            if (!found) {
	                var ignore = defaultIgnores;
	                if (modes[currentMode].ignore != null) {
	                    ignore = modes[currentMode].ignore;
	                }
	
	                if (ignore.indexOf(token.type) == -1) {
	
	                    var expected = [];
	
	                    var modeKeys = Object.keys(modes[currentMode].expect);
	
	                    for (var _i2 = 0; _i2 < modeKeys.length; _i2++) {
	                        expected = expected.concat(modes[currentMode].expect[modeKeys[_i2]]);
	                    }
	
	                    throw new Error(_chalk2.default.red("Syntax Error: Expected " + (0, _utils.formatList)(expected) + " but got " + token.type + " instead. At line " + token.line + ":" + token.linePos + " (" + currentMode + ")"));
	                }
	            }
	        }
	    }
	
	    return result;
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.iterateObject = iterateObject;
	exports.filterObject = filterObject;
	exports.mapObject = mapObject;
	exports.processObject = processObject;
	exports.formatList = formatList;
	exports.processArray = processArray;
	function iterateObject(object, process) {
	
		var keys = Object.keys(object);
	
		for (var i = 0; i < keys.length; i++) {
	
			var key = keys[i];
			var value = object[key];
			process(key, value);
		}
	}
	
	function filterObject(object, process) {
	
		var result = {};
	
		processObject(object, function (key, value) {
			if (process(key, value)) {
				result[key] = value;
			}
		});
	
		return result;
	}
	
	function mapObject(object, process, callback) {
		var result = {};
	
		processObject(object, function (key, value, done) {
			process(key, value, function (res) {
				result[key] = res;
				done();
			});
		}, function (err) {
			callback(result);
		});
	}
	
	function processObject(object, process, callback) {
	
		if (object == null) {
			return callback(null, null);
		}
	
		var keys = Object.keys(object);
	
		var needed = keys.length;
		var done = 0;
	
		if (needed == 0) {
			return callback(null, {});
		}
	
		var next = function next() {
	
			process(keys[done], object[keys[done]], function (err) {
				if (err != null) {
					return callback(err);
				}
	
				done++;
				if (done == needed) {
					callback();
				} else {
					next();
				}
			});
		};
	
		next();
	}
	
	function formatList(list) {
	
		var result = "";
		if (list.length > 2) {
			var lastItem = list[list.length - 1];
	
			list.pop();
	
			result = list.join(", ") + " or " + lastItem;
	
			return result;
		}
	
		if (list.length == 2) {
			result = list[0] + " or " + list[1];
			return result;
		}
	
		if (list.length == 1) {
			result = list[0];
			return result;
		}
	}
	
	function processArray(array, process, callback) {
	
		if (array.length == 0) {
			callback();
		}
	
		var needed = array.length;
		var done = 0;
	
		var next = function next() {
	
			if (done == needed) {
				return callback();
			}
	
			process(array[done], function (err) {
	
				if (err != null) {
					callback(err);
				} else {
	
					done++;
					next();
				}
			});
		};
	
		next();
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
					value: true
	});
	exports.lex = lex;
	function lex(source) {
	
					var tokens = [];
	
					var types = {
									"\n": "newLine",
									"\r": "newLine",
									"\t": "indent",
									"?": "questionMark",
									"'": "singleQuote",
									"\"": "doubleQuote",
									"{": "curlyOpen",
									"}": "curlyClose",
									"(": "braceOpen",
									"=": "equals",
									")": "braceClose",
									";": "semiColon",
									":": "colon",
									".": "dot",
									"\\": "backwardSlash",
									"/": "forwardSlash",
									"#": "hashtag",
									",": "comma",
									"@": "atSign",
									">": "gT",
									"<": "lT",
									"[": "bracketOpen",
									"]": "bracketClose"
					};
	
					var line = 1;
					var linePos = 1;
	
					var currentWord = null;
					var wordLine = 0;
					var wordPos = 0;
					var wordLinePos = 0;
	
					for (var i = 0; i < source.length; i++) {
	
									var letter = source[i];
	
									if (letter == "\n") {
													line++;
													linePos = 0;
									}
	
									var type = types[letter];
	
									if (type == null) {
	
													if (currentWord == null) {
	
																	wordLine = line;
																	wordLinePos = linePos;
																	wordPos = i;
																	currentWord = "";
													}
	
													currentWord += letter;
									} else {
	
													if (currentWord != null) {
	
																	tokens.push({
																					type: "word",
																					value: currentWord,
																					line: wordLine,
																					linePos: wordLinePos,
																					totalPos: wordPos
																	});
	
																	currentWord = null;
													}
	
													tokens.push({
																	type: type,
																	value: letter,
																	line: line,
																	linePos: linePos,
																	totalPos: i
													});
									}
	
									linePos++;
					}
	
					if (currentWord != null) {
	
									tokens.push({
													type: "word",
													value: currentWord,
													line: wordLine,
													linePos: wordLinePos,
													totalPos: wordPos
									});
	
									currentWord = null;
					}
	
					// Convert and reduce tokens
	
	
					tokens = findWhitespace(tokens);
					tokens = findComments(tokens);
					tokens = findNumbers(tokens);
					tokens = findStrings(tokens);
					tokens = findBooleans(tokens);
					tokens = findInclude(tokens);
	
					return tokens;
	}
	
	function findInclude(tokens) {
					var result = [];
					var inInclude = false;
	
					var currentInclude = [];
					for (var i = 0; i < tokens.length; i++) {
	
									var token = tokens[i];
	
									if (token.type == "dot") {
													currentInclude.push(token);
									} else {
													if (currentInclude.length == 3) {
																	currentInclude[0].type = "include";
																	currentInclude[0].value = "...";
	
																	result.push(currentInclude[0]);
																	result.push(token);
																	currentInclude = [];
													} else if (currentInclude.length == 0) {
																	result.push(token);
													} else {
																	result = result.concat(currentInclude);
																	result.push(token);
																	currentInclude = [];
													}
									}
					}
	
					if (currentInclude.length == 3) {
	
									currentInclude[0].type = "include";
									currentInclude[0].value = "...";
									result.push(currentInclude[0]);
					} else {
									result = result.concat(currentInclude);
					}
	
					return result;
	}
	
	function findStrings(tokens) {
					var result = [];
	
					var inString = false;
					var quoteType = null;
					var currentString = [];
	
					var stringLine = void 0;
					var stringLinePos = void 0;
					var stringTotalPos = void 0;
	
					for (var i = 0; i < tokens.length; i++) {
	
									var token = tokens[i];
	
									if (inString) {
	
													if (token.type == quoteType) {
	
																	// End of string
																	currentString.shift();
	
																	currentString[0].value = currentString.map(function (item) {
																					return item.value;
																	}).join("");
	
																	currentString[0].type = "string";
	
																	result.push(currentString[0]);
	
																	inString = false;
																	quoteType = null;
																	currentString = [];
													} else {
																	// Add to string
																	currentString.push(token);
													}
									} else {
	
													if (token.type == "singleQuote" || token.type == "doubleQuote") {
																	// New String
																	currentString.push(token);
	
																	inString = true;
																	quoteType = token.type;
													} else {
																	result.push(token);
													}
									}
					}
	
					if (inString) {
									result = result.concat(currentString);
					}
	
					return result;
	}
	
	function findNumbers(tokens) {
	
					var result = [];
	
					for (var i = 0; i < tokens.length; i++) {
									var token = tokens[i];
									if (token.type == "word") {
													if (!isNaN(parseFloat(token.value))) {
																	token.type = "number";
																	token.value = parseFloat(token.value);
													}
									}
	
									result.push(token);
					}
	
					return result;
	}
	
	function findBooleans(tokens) {
	
					var result = [];
	
					for (var i = 0; i < tokens.length; i++) {
	
									var token = tokens[i];
	
									if (token.type == "word") {
													if (token.value.toLowerCase() == "true") {
																	token.type = "boolean";
																	token.value = true;
													} else if (token.value.toLowerCase() == "false") {
																	token.type = "boolean";
																	token.value = false;
													}
									}
	
									result.push(token);
					}
	
					return result;
	}
	
	function findComments(tokens) {
					var result = [];
	
					var currentComment = [];
	
					for (var i = 0; i < tokens.length; i++) {
									var token = tokens[i];
	
									if (currentComment.length == 0 || currentComment.length == 1) {
	
													if (token.type == "forwardSlash") {
																	currentComment.push(token);
													} else {
																	result = result.concat(currentComment);
																	result.push(token);
																	currentComment = [];
													}
									} else {
													if (token.type == "newLine") {
																	var value = "";
																	for (var _i = 0; _i < currentComment.length; _i++) {
																					value += currentComment[_i].value;
																	}
																	currentComment[0].type = "comment";
																	currentComment[0].value = value;
																	result.push(currentComment[0]);
																	result.push(token);
																	currentComment = [];
													} else {
																	currentComment.push(token);
													}
									}
					}
	
					if (currentComment.length == 1) {
	
									result = result.concat(currentComment);
					} else if (currentComment.length != 0) {
									var _value = "";
									for (var _i2 = 0; _i2 < currentComment.length; _i2++) {
													_value += currentComment[_i2].value;
									}
									currentComment[0].type = "comment";
									currentComment[0].value = _value;
									result.push(currentComment[0]);
					}
	
					return result;
	}
	
	function isWhiteSpace(letter) {
					return letter == " ";
	}
	
	function findWhitespace(tokens) {
	
					var result = [];
	
					for (var i = 0; i < tokens.length; i++) {
	
									var token = tokens[i];
	
									if (token.type == "word") {
	
													// Iterate over the word
	
	
													var currentString = "";
													var begin = token.linePos;
													var currentlyWhiteSpace = isWhiteSpace(token.value.charAt(0));
	
													for (var j = 0; j < token.value.length; j++) {
	
																	var letter = token.value[j];
	
																	var isChar = isWhiteSpace(letter);
	
																	var a = currentlyWhiteSpace != isWhiteSpace(letter) && currentString.length != 0;
	
																	var b = j == token.value.length - 1;
	
																	if (a || b) {
	
																					result.push({
																									type: currentlyWhiteSpace ? "space" : "word",
																									value: j == token.value.length - 1 ? currentString + letter : currentString,
																									line: token.line,
																									linePos: begin
																					});
	
																					begin = token.linePos + j;
																					currentString = letter;
																					currentlyWhiteSpace = isWhiteSpace(letter);
																	} else {
																					currentString += letter;
																					currentlyWhiteSpace = isWhiteSpace(letter);
																	}
													}
									} else {
	
													result.push(token);
									}
					}
	
					return result;
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** `Object#toString` result references. */
	var numberTag = '[object Number]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Number` primitive or object.
	 *
	 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
	 * as numbers, use the `_.isFinite` method.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isNumber(3);
	 * // => true
	 *
	 * _.isNumber(Number.MIN_VALUE);
	 * // => true
	 *
	 * _.isNumber(Infinity);
	 * // => true
	 *
	 * _.isNumber('3');
	 * // => false
	 */
	function isNumber(value) {
	  return typeof value == 'number' ||
	    (isObjectLike(value) && objectToString.call(value) == numberTag);
	}
	
	module.exports = isNumber;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a boolean primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isBoolean(false);
	 * // => true
	 *
	 * _.isBoolean(null);
	 * // => false
	 */
	function isBoolean(value) {
	  return value === true || value === false ||
	    (isObjectLike(value) && objectToString.call(value) == boolTag);
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isBoolean;


/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * lodash 4.0.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** `Object#toString` result references. */
	var stringTag = '[object String]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
	}
	
	module.exports = isString;


/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var string = {
		minLength: {
			parameterType: "number",
			itemTypes: ["string"],
			validate: function validate(item, value, callback, options) {
				// options = { store, parameters }
				if (item.length < value) {
					callback("tooShort", null);
				} else {
					callback(null, item);
				}
			}
		},
		maxLength: {
			parameterType: "number",
			itemTypes: ["string"],
			validate: function validate(item, value, callback, options) {
				// options = { store, parameters }
				if (item.length > value) {
	
					callback("tooLong", null);
				} else {
					callback(null, item);
				}
			}
		},
		trim: {
			parameterType: "boolean",
			itemTypes: ["string"],
			validate: function validate(item, value, callback, options) {
				// options = { store, parameters }
				callback(null, value ? item.trim() : item);
			}
		}
	};
	
	exports.default = string;

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var number = {
		min: {
			parameterType: "number",
			itemTypes: ["number"],
			validate: function validate(item, value, callback, options) {
				// options = { store, parameters }
				if (item < value) {
					callback("tooSmall", null);
				} else {
					callback(null, item);
				}
			}
		},
		max: {
			parameterType: "number",
			itemTypes: ["number"],
			validate: function validate(item, value, callback, options) {
				// options = { store, parameters }
				if (item > value) {
	
					callback("tooBig", null);
				} else {
					callback(null, item);
				}
			}
		},
		allowDecimals: {
			parameterType: "boolean",
			itemTypes: ["number"],
			validate: function validate(item, value, callback, options) {
				if (item % 1 != 0 && !value) {
					return callback("notWholeNumber", null);
				} else {
					callback(null, item);
				}
			}
		},
		round: {
			parameterType: "number",
			itemTypes: ["number"],
			validate: function validate(item, value, callback, options) {
				var precision = Math.pow(10, value);
				item = Math.round(item * precision) / precision;
				callback(null, item);
			}
		},
		floor: {
			parameterType: "number",
			itemTypes: ["number"],
			validate: function validate(item, value, callback, options) {
				var precision = Math.pow(10, value);
				item = Math.floor(item * precision) / precision;
				callback(null, item);
			}
		},
		ceil: {
			parameterType: "number",
			itemTypes: ["number"],
			validate: function validate(item, value, callback, options) {
				var precision = Math.pow(10, value);
				item = Math.ceil(item * precision) / precision;
				callback(null, item);
			}
		}
	
	};
	
	exports.default = number;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=sure-js.js.map