var gulp = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
clean = require('gulp-clean'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
livereload = require('gulp-livereload'),
webserver = require('gulp-webserver');

gulp.task('styles', function() {
	console.log("生成 css 文件 " + (new Date()).toString());
	return gulp.src('styles/*.scss') //会编译styles目录下的以scss结尾的scss文件
		.pipe(sass({ style: 'expanded' }))
		.pipe(autoprefixer('ios 6', 'android 4'))
		.pipe(gulp.dest('dist/styles/'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/styles/'))
		.pipe(livereload())
		// .pipe(notify({ message: '生成并压缩css done....' }));
});

gulp.task('scripts', function() {
	return gulp.src('scripts/*.js')
		// .pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		// .pipe(concat('main.js'))
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(livereload())
		// .pipe(notify({ message: '生成并压缩js done....' }));
});

gulp.task('images', function() {
	return gulp.src('images/*')
		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		.pipe(gulp.dest('dist/images'))
		.pipe(livereload())
		// .pipe(notify({ message: '图片整理并压缩 done....' }));
});

gulp.task('html', function() {
    return gulp.src('*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(livereload())
        // .pipe(notify({ message: '生成并整理Html done....' }));
});

//清除所有的生成文件
gulp.task('clean', function() {
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

gulp.task('webserver', function() {
	gulp.src( './' ) // 服务器目录（./代表根目录）
	.pipe(webserver({
		livereload: true, // 启用LiveReload
		open: true // 服务器启动时自动打开网页
	}));
});

gulp.task('watch', function() {
	livereload.listen();
	// Watch .scss files
	gulp.watch('styles/*.scss', ['styles'], function(file){
		 livereload.changed(file.path);
	});
	// Watch .js files
	gulp.watch('scripts/*.js', ['scripts'], function(file){
		 livereload.changed(file.path);
	});
	// Watch image files
	gulp.watch('images/*', ['images'], function(file){
		 livereload.changed(file.path);
	});
	// Watch html files
    gulp.watch('*.html', ['html'], function(file){
		 livereload.changed(file.path);
	});
});

// gulp.task('default', ['clean'], function() {
gulp.task('serve', function() {
	gulp.start('styles', 'scripts', 'images', 'webserver','watch');
});
gulp.task('build', function() {
	gulp.start('clean', 'styles', 'scripts', 'images');
});