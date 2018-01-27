const path = require('path')
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const minifycss = require('gulp-minify-css')
const cssBeautify = require('gulp-cssbeautify')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const tinypng = require('gulp-tinypng')
// png 深度压缩
const rename = require('gulp-rename')
const zip = require('gulp-zip') // 打包
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const notify = require('gulp-notify')
const cache = require('gulp-cache')
const livereload = require('gulp-livereload')
const webserver = require('gulp-webserver')
const debug = require('gulp-debug')
const sftp = require('gulp-sftp')
const ftp = require('gulp-ftp')
const foal = require('gulp-foal')(global) // task传参数
const watch = require('gulp-watch')
const exec = require('child_process').exec;
// 配置文件
const config = require('./config.json')

gulp.task('styles', function () {
	return gulp.src('src/styles/**/*.scss') //会编译styles目录下的以scss结尾的scss文件
		.pipe(debug({
			title: 'css打包:'
		}))
		.pipe(sass({
			style: 'expanded'
		}))
		.pipe(autoprefixer('ios 6', 'android 4'))
		.pipe(cssBeautify({
			indent: '  ',
			openbrace: 'end-of-line',
			autosemicolon: true
		}))
		.pipe(gulp.dest('dist/styles/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/styles/'))
		.pipe(livereload())
})

// 只有eslint通过了才经行script打包
gulp.task('scripts', ['lint'], function () {
	return gulp.src('src/scripts/**/*.js')
		.pipe(debug({
			title: 'js打包:'
		}))
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(livereload())
})

gulp.task('images', function () {
	return gulp.src('src/images/**')
		.pipe(gulp.dest('dist/images'))
		.pipe(livereload())
})

// 压缩图片 - tinypng
gulp.task('tinypng', function () {
	return gulp.src('src/images/**/*.{png,jpg,jpeg}')
		.pipe(debug({
			title: 'tinypng压缩:'
		}))
		.pipe(tinypng(config.tinypngApi))
		.pipe(gulp.dest('./dist/images'))
})

gulp.task('html', function () {
	return gulp.src('src/*.html')
		.pipe(debug({
			title: 'html打包:'
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(livereload())
})

// 清除所有的生成文件
gulp.task('clean', function () {
	return gulp.src(['dist'], {
		read: false
	}).pipe(clean())
})

gulp.task('webserver', ['html', 'images', 'styles', 'scripts'], function () {
	return gulp.src('./dist/') // 服务器目录（./代表根目录）
		.pipe(webserver({
			host: config.localServer.host,
			port: config.localServer.port,
			open: true, // 服务器启动时自动打开网页
			directoryListing: false,
			auto: false
		}))
})

gulp.task('lint', () => {
	return gulp.src(['src/scripts/**/*.js', '!node_modules/**', '!dist/**'])
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe(eslint.failAfterError())
})

gulp.task('watch', function () {
	livereload.listen()
	// 监听 .scss
	watch('src/styles/**/*.scss', function (file, cb) {
		gulp.start('styles', function () {
			if (config.upload.use) {
				foal.run(upload(path.join(file.path)), cb)
			}
			livereload.changed(file.path)
		})
	})
	// 监听 .js
	watch('src/scripts/**/*.js', function (file, cb) {
		gulp.start('lint')
	})
	// 监听 images
	watch('src/images/**', function (file, cb) {
		gulp.start('images', function () {
			if (config.upload.use) {
				foal.run(upload(file.path), cb)
			}
			livereload.changed(file.path)
		})
	})
	// 监听 html
	watch('src/*.html', function (file, cb) {
		gulp.start('html', function () {
			if (config.upload.use) {
				foal.run(upload(path.join(file.path)), cb)
			}
			livereload.changed(file.path)
		})
	})
})

// 打包文件
gulp.task('zip', function () {
	function checkTime(i) {
		if (i < 10) {
			i = "0" + i
		}
		return i
	}
	var d = new Date()
	var year = d.getFullYear()
	var month = checkTime(d.getMonth() + 1)
	var day = checkTime(d.getDate())
	var hour = checkTime(d.getHours())
	var minute = checkTime(d.getMinutes())

	return gulp.src('./dist/**')
		.pipe(debug({
			title: '打包成zip:'
		}))
		.pipe(zip(config.project + '-' + year + month + day + '-' + hour + minute + '.zip'))
		.pipe(gulp.dest('./'))
})

// 上传到远程服务器任务，使用foal定义上传任务
foal.task('upload', function (filePath, cb) {
	if (config.upload.protocol === "ftp" || config.upload.protocol === "Ftp" || config.upload.protocol === "FTP") {
		return gulp.src(filePath)
			.pipe(debug({
				title: 'ftp上传:'
			}))
			.pipe(ftp({
				host: config.upload.host,
				user: config.upload.user,
				pass: config.upload.password,
				port: config.upload.port,
				remotePath: config.upload.remotePath
			}))
	} else if (config.upload.protocol === "sftp" || config.upload.protocol === "Sftp" || config.upload.protocol === "SFTP") {
		return gulp.src(filePath)
			.pipe(debug({
				title: 'sftp上传:'
			}))
			.pipe(sftp({
				host: config.upload.host,
				user: config.upload.user,
				pass: config.upload.password,
				port: config.upload.port,
				remotePath: config.upload.remotePath
			}))
	}
})

// 默认任务
gulp.task('default', function () {
	gulp.start('webserver')
	gulp.start('watch')
})

gulp.task('build', ['clean'], function () {
	gulp.start('styles')
	gulp.start('scripts')
	gulp.start('images')
	gulp.start('html')
})

// 提交代码执行的任务
gulp.task('build2', ['clean'], function () {
	gulp.start('styles')
	gulp.start('scripts')
	gulp.start('tinypng')
	gulp.start('html')
	gulp.start('zip')
})
