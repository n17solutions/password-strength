'use strict';

var app = angular.module('n17-validators');

app.directive('passwordStrength', [require('./passwordstrength')]);