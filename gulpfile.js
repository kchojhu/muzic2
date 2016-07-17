var gulp = require('gulp');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync');
var args = require('yargs').argv;

var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var del = require('del');

var src = 'src/main/webapp/';
var dist = 'src/main/webapp/dist/';

var tsconfig = typescript.createProject('tsconfig.json');

gulp.task('build-ts', function () {
    return gulp.src(src + 'app/**/*.ts')
        .pipe(gulpif(!args.production, sourcemaps.init()))
        .pipe(typescript(tsconfig))
        .pipe(gulpif(!args.production, sourcemaps.write()))
        .pipe(gulp.dest(dist + 'app'));
});

gulp.task('browserSync', ['watch'], function() {
	var options = {
			proxy: 'localhost:8080',
			port: 4000,
			reloadDelay:1000,
			files:['src/main/webapp/dist/app/*.css'],
//			browser: 'firefox',
			logLevel: 'debug',
			injectChange: true,
			logFileChange: true,
			logPrefix: 'gulp-patterns',
			notify:true
	};
//	browsers: 'google chrome',

	browserSync(options);
	
	//gulp.watch([].concat.apply(config.indexFile), browserSync.reload);
//	gulp.watch(['src/main/webapp/index.html', 'src/main/webapp/app/**/*.js', 'target/classes/**/*.class'], function() {
//		browserSync.reload({stream:false});
//	});

	return gulp.watch(['src/main/webapp/dist/index.html', 'src/main/webapp/dist/app/**/*.js'], function() {
		return browserSync.reload({stream:false});
	});

});

gulp.task('build-copy', ['build-ts'], function () {
    gulp.src([src + 'app/**/*.html', src + 'app/**/*.htm', src + 'app/**/*.css'])
        .pipe(gulp.dest(dist + 'app'));

    gulp.src([src + 'index.html', src + 'chat.html'])
        .pipe(gulp.dest(dist));

    return gulp.src([src + 'systemjs.config.js'])
        .pipe(gulp.dest(dist));
});

gulp.task('build-copy-css', function () {
    return gulp.src([src + 'app/**/*.css'])
        .pipe(gulp.dest(dist + 'app'));
});

gulp.task('clean', function() {
    return del([dist + '/**/*.html', dist + '/**/*.htm', dist + '/**/*.css'], dist + 'app');
});

gulp.task('vendor', ['clean'], function() {
    del.sync([dist + '/vendor/**/*'], {force: true});
    gulp.src('node_modules/@angular/**')
        .pipe(gulp.dest(dist + 'vendor/@angular/'));

    //ES6 Shim
    gulp.src('node_modules/es6-shim/**')
        .pipe(gulp.dest(dist + '/vendor/es6-shim/'));

    //reflect metadata
    gulp.src('node_modules/reflect-metadata/**')
        .pipe(gulp.dest(dist + '/vendor/reflect-metadata/'));

    //rxjs
    gulp.src('node_modules/rxjs/**')
        .pipe(gulp.dest(dist + '/vendor/rxjs/'));

    //systemjs
    gulp.src('node_modules/systemjs/**')
        .pipe(gulp.dest(dist + '/vendor/systemjs/'));
    
    // ng2-bootstrap
    gulp.src('node_modules/lockr/**')
        .pipe(gulp.dest(dist + '/vendor/lockr/'));

    //zonejs
    return gulp.src('node_modules/zone.js/**')
        .pipe(gulp.dest(dist + '/vendor/zone.js/'));
});

gulp.task('watch', ['build'], function() {
   gulp.watch(src + '**/*.ts', ['build-ts']);
   gulp.watch([src + '**/*.{html,htm}', '!' + dist],  ['build-copy']);
   return gulp.watch([src + '**/*.css', '!' + dist],  ['build-copy-css']);
});

gulp.task('build', ['build-ts', 'build-copy']);
gulp.task('default', ['build', 'watch']);
gulp.task('serve', ['build', 'watch', 'browserSync'], function(){});