(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define(["angular"], factory);
	else if(typeof exports === 'object')
		exports["n17passwordstrength"] = factory(require("angular"));
	else
		root["n17passwordstrength"] = factory(root["angular"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(1);

	try {
	  angular.module('n17-validators');
	} catch (e) {
	  angular.module('n17-validators', [])
	}

	__webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var app = angular.module('n17-validators');

	app.directive('n17PasswordStrength', [__webpack_require__(3)]);


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function() {
		var requiredComplexity, requiredCharsets;
		var labels = ['success', 'warning', 'danger'];
		var results = [
			{ rank: 1, complexity: 'Too short', label: 'danger' },
			{ rank: 2, complexity: 'Too few character types', label: 'warning' },
			{ rank: 3, complexity: 'Very weak' },
			{ rank: 4, complexity: 'Weak' },
			{ rank: 5, complexity: 'Poor' },
			{ rank: 6, complexity: 'Good' },
			{ rank: 7, complexity: 'Strong' },
			{ rank: 8, complextiy: 'Very Strong' }
		];

		function hasLowerCase(string) {
			return /[a-z]+/.test(string);
		}

		function hasUpperCase(string) {
			return /[A-Z]+/.test(string);
		}

		function hasNumeric(string) {
			return /[0-9]+/.test(string);
		}

		function hasSpecial(string) {
			return /[@$-/:-?{-~!"^_`\[\]]/g.test(string);
		}

		function getResult(score) {
			var percentage = (score * 100) / 20;
			var result = percentage < 20 ? results[2] :
				percentage < 35 ? results[3] :
				percentage < 50 ? results[4] :
				percentage < 65 ? results[5] :
				percentage < 90 ? results[6] :
				results[7];

			var rankDifference = requiredComplexity - result.rank;
			if (rankDifference >= labels.length) {
				rankDifference = labels.length - 1;
			} else if (rankDifference < 0) {
				rankDifference = 0;
			}

			result.label = labels[rankDifference];

			return result;
		}

		return {
			require: 'ngModel',
			scope: {
				model: 	'=ngModel',
				target: '@',
				callback: '&'
			},
			templateUrl: '/templates/strength.tpl.html',
			replace: true,
			link: function(scope, elem, attrs) {
				var minLength = parseInt(attrs.minLength) || 6;
				var formCtrl = elem.inheritedData('$formController');

				requiredComplexity = parseInt(attrs.complexity) > 8 ? 8 : parseInt(attrs.complexity) || 6;
				requiredCharsets = parseInt(attrs.charsets) > 4 ? 4 : parseInt(attrs.charsets) || 1;

				var updateStrength = function(string) {
					var charsets = 0, score = 0;
					if (string) {
						// Gain points based on variation of character types
						if (hasLowerCase(string)) {
							charsets++;
						}
						if (hasUpperCase(string)) {
							charsets++;
						}
						if (hasNumeric(string)) {
							charsets++;
						}
						if (hasSpecial(string)) {
							charsets++;
						}

						// Length improves weighting
						score = charsets * (string.length / 2);

						// Requires a minimum length
						scope.result = string.length >= minLength ? (requiredCharsets <= charsets ? getResult(score) : results[1]) : results[0];
					} else {
						scope.result = results[0];
					}

					formCtrl[scope.target].$setValidity('strength', requiredComplexity <= scope.result.rank && requiredCharsets <= charsets);

					if (scope.callback) {
						scope.callback({ result: scope.result.complexity });
					}
				};

				scope.$watch('model', updateStrength);
			}
		};
	};


/***/ }
/******/ ])
});
;
!function(l){try{l=angular.module("n17-validators")}catch(a){l=angular.module("n17-validators",[])}l.run(["$templateCache",function(l){l.put("/templates/strength.tpl.html",'<span class="label label-{{ result.label }}">{{ result.complexity }}</span>')}])}();