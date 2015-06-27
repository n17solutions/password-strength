'use strict';

var gulp 		= require('gulp'),
	webpack 	= require('gulp-webpack-build'),
	extend 		= require('lodash/object/extend'),
	stylus 		= require('gulp-stylus'),
	del 		= require('del'),
	nib 		= require('nib'),
	runSequence = require('run-sequence'),
	minifyHtml 	= require('gulp-minify-html'),
	html2js		= require('gulp-ng-html2js'),
	uglify		= require('gulp-uglify'),
	concat		= require('gulp-concat'),
	rename		= require('gulp-rename'),
	minifyCss	= require('gulp-minify-css'),
	app 		= {
		src: {
			js: 		'./src/js',
			stylus: 	'./src/stylus',
			templates: 	'./src/templates'
		},
		dist: {
			root: 				'./dist',
			withoutFrameworks: 	'./dist/no-frameworks',
			withFrameworks: 	'./dist/inc-frameworks',
			templates: 			'./dist/templates'
		},
		webpack: {
			options: {
				watchDelay: 	200
			},
			config: {
				useMemoryFs: 	true,
				progress: 		true
			},
			format: {
				version: 		false,
				timings: 		true
			},
			failAfter: {
				errors: 		true,
				warnings: 		true
			},
			files: {
				production: 	'./webpack.config-production.js',
				productionMin: 	'./webpack.config-production.min.js',
				development: 	'./webpack.config-development.js',
				developmentMin: './webpack.config-development.min.js'
			}
		},
		minifyCss: {
			compatibility: 'ie8'
		}
	};

function buildWebpackOptions(mode) {
	switch (mode) {
		case "development":
			extend(app.webpack.options, {
				debug: true,
				devtool: '#source-map'
			});
			break;
	}
}

gulp.task('clean', function() {
	return del(app.dist.root);
});

gulp.task('clean:templates', function() {
	return del(app.dist.templates);
});

gulp.task('stylus', function() {
	return gulp.src(app.src.stylus + '/**/*.styl')
		.pipe(stylus({
			use: [
				nib()
			]
		}))
		.pipe(rename({
			prefix: 'n17-'
		}))
		.pipe(gulp.dest(app.dist.root));
});

gulp.task('minify:css', ['stylus'], function() {
	return gulp.src(app.dist.root + '/*.css')
		.pipe(minifyCss(app.minifyCss))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(app.dist.root));
});

gulp.task('html2js', [], function() {
	return gulp.src(app.src.templates + '/**/*.tpl.html')
		.pipe(minifyHtml({
			empty: 	true,
			spare: 	true,
			quotes: true
		}))
		.pipe(html2js({
			moduleName: 'n17-validators',
			prefix: 	'/templates/'
		}))
		.pipe(concat('templates.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/templates'));
});

gulp.task('build-development', ['minify:css', 'html2js'], function() {
	buildWebpackOptions('development');

	return gulp.src(app.webpack.files.development)
		.pipe(webpack.init(app.webpack.config))
		.pipe(webpack.props(app.webpack.options))
		.pipe(webpack.run())
		.pipe(webpack.format(app.webpack.format))
		.pipe(webpack.failAfter(app.webpack.failAfter))
		.pipe(gulp.dest(app.dist.withFrameworks));
});

gulp.task('package:development', ['build-development'], function() {
	return gulp.src([app.dist.withFrameworks + '/n17-password-strength.js', app.dist.templates + '/templates.js'])
		.pipe(concat('n17-password-strength.js'))
		.pipe(gulp.dest(app.dist.withFrameworks));
});

gulp.task('build-production', [], function() {
	buildWebpackOptions('production');

	gulp.src(app.webpack.files.productionMin)
		.pipe(webpack.init(app.webpack.config))
		.pipe(webpack.props(app.webpack.options))
		.pipe(webpack.run())
		.pipe(webpack.format(app.webpack.format))
		.pipe(webpack.failAfter(app.webpack.failAfter))
		.pipe(gulp.dest(app.dist.withoutFrameworks));

	return gulp.src(app.webpack.files.production)
		.pipe(webpack.init(app.webpack.config))
		.pipe(webpack.props(app.webpack.options))
		.pipe(webpack.run())
		.pipe(webpack.format(app.webpack.format))
		.pipe(webpack.failAfter(app.webpack.failAfter))
		.pipe(gulp.dest(app.dist.withoutFrameworks));
});

gulp.task('package:production', ['build-production'], function() {
	gulp.src([app.dist.withoutFrameworks + '/n17-password-strength.js', app.dist.templates + '/*.js'])
		.pipe(concat('n17-password-strength.js'))
		.pipe(gulp.dest(app.dist.withoutFrameworks));

	return gulp.src([app.dist.withoutFrameworks + '/n17-password-strength.min.js', app.dist.templates + '/*.js'])
		.pipe(concat('n17-password-strength.min.js'))
		.pipe(gulp.dest(app.dist.withoutFrameworks));
});

gulp.task('build-production-inc-frameworks', [], function() {
	buildWebpackOptions('production');

	gulp.src(app.webpack.files.developmentMin)
		.pipe(webpack.init(app.webpack.config))
		.pipe(webpack.props(app.webpack.options))
		.pipe(webpack.run())
		.pipe(webpack.format(app.webpack.format))
		.pipe(webpack.failAfter(app.webpack.failAfter))
		.pipe(gulp.dest(app.dist.withFrameworks));

	return gulp.src(app.webpack.files.development)
		.pipe(webpack.init(app.webpack.config))
		.pipe(webpack.props(app.webpack.options))
		.pipe(webpack.run())
		.pipe(webpack.format(app.webpack.format))
		.pipe(webpack.failAfter(app.webpack.failAfter))
		.pipe(gulp.dest(app.dist.withFrameworks));
});

gulp.task('package:production-inc-frameworks', ['build-production-inc-frameworks'], function() {
	gulp.src([app.dist.withFrameworks + '/n17-password-strength.js', app.dist.templates + '/*.js'])
		.pipe(concat('n17-password-strength.js'))
		.pipe(gulp.dest(app.dist.withFrameworks));

	return gulp.src([app.dist.withFrameworks + '/n17-password-strength.min.js', app.dist.templates + '/*.js'])
		.pipe(concat('n17-password-strength.min.js'))
		.pipe(gulp.dest(app.dist.withFrameworks));
});

gulp.task('production', [], function(cb) {
	runSequence('clean', 'minify:css', 'html2js', 'package:production', 'package:production-inc-frameworks', 'clean:templates', cb);
});