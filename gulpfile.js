var args = require('yargs').argv;
var browserSync = require('browser-sync');
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({lazy:true});
var config = require('./gulp.config')();

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

//gulp.task('watch-javascript'. function() {
//	gulp.watch(config.jsFiles, )
//});

//gulp.task('compile-ts', function () {
//    var sourceTsFiles = [config.allTypeScript,                //path to typescript files
//                         config.libraryTypeScriptDefinitions]; //reference to library .d.ts files
//                        
//
//    var tsResult = gulp.src(sourceTsFiles)
//                       .pipe(sourcemaps.init())
//                       .pipe(tsc(tsProject));
//
//        tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
//        return tsResult.js
//                        .pipe(sourcemaps.write('.'))
//                        .pipe(gulp.dest(config.tsOutputPath));
//});
//			files:['src/main/resources/webapp/index.html', 'target/classes/**/*.class', 'src/main/resources/webapp/app/**/*.js', 'src/main/resources/public/**/*.css'],
gulp.task('serve', function() {
	var options = {
			proxy: 'localhost:8080',
			port: 4000,
			reloadDelay:500,
			files:['src/main/webapp/css/*.css'],
//			browser: 'firefox',
			logLevel: 'debug',
			injectChange: true,
			logFileChange: true,
			logPrefix: 'gulp-patterns',
			notify:true
	};
//	browsers: 'google chrome',
//	browser: 'firefox',
	//			files:['src/main/webapp/index.html', 'target/classes/**/*.class', 'target/classes/**/*.js', 'target/classes/**/*.css'],

	browserSync(options);
	
	//gulp.watch([].concat.apply(config.indexFile), browserSync.reload);
	gulp.watch(['src/main/webapp/index.html', 'src/main/webapp/app/**/*.js', 'target/classes/**/*.class'], function() {
		browserSync.reload({stream:false});
	});
});

