# N17 Password Strength

## Angular Directive

Detect the strength of a string, usually a password, to determine whether to accept the input as valid

### Installation

**Bower**

`bower install --save n17passwordstrength`

**GitHub**

https://github.com/n17solutions/password-strength.git

The usable files are housed in the **dist** folder

### Compatibility

N17 Password Strength requires:
* AngularJS

If you are already using these frameworks in your project, you should use the files from the **no-frameworks** folder. We have also included a full bundle in the **inc-frameworks** folder.

If using the **inc-frameworks** source, you will need to bootstrap an AngularJS App around all N17 Wait Directives on the page. For Example:

```html
<div ng-app="n17-validators">
	<input type="password" name="password" ng-model="user.password" />
	<span target="password" ng-model="user.password" min-length="4" complexity="6" charsets="3" n17-password-strength></span>
		...
```

If using AngularJS in your app already, you will need to add N17 Validators as a dependency of your app. For Example:
```javascript
var app = angular.module('myapp', ['n17-validators']);
```

### Usage

```html
<input type="password" name="password" ng-model="user.password" />
<span target="password" ng-model="user.password" min-length="4" complexity="6" charsets="3" n17-password-strength></span>
```

### Result callback

You can specify a function within the callback attribute to gather the result of the complexity function, the argument
required is called 'result'. For Example:

```html
<input type="password" name="password" ng-model="user.password" />
<span target="password" ng-model="user.password" min-length="4" complexity="6" charsets="3" callback="callbackFunc(result)" n17-password-strength></span>
```
