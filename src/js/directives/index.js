'use strict';

var app = angular.module('n17-validators');

app.directive('n17PasswordStrength', [require('./passwordstrength')]);
