var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	tinypng = require('gulp-tinypng'),
	// png 深度压缩
	pngquant = require('imagemin-pngquant'),
	rename = require('gulp-rename'),
	zip = require('gulp-zip'), // 打包
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	webserver = require('gulp-webserver'),
	debug = require('gulp-debug');
sftp = require('gulp-sftp'),
	ftp = require('gulp-ftp'),
	foal = require('gulp-foal')(global), // task传参数
	watch = require('gulp-watch'),
	// 配置文件
	config = require('./config.json');

gulp.task('styles', function () {
	return gulp.src('src/styles/**/*.scss') //会编译styles目录下的以scss结尾的scss文件
		.pipe(debug({
			title: 'css打包:'
		}))
		.pipe(sass({
			style: 'expanded'
		}))
		.pipe(autoprefixer('ios 6', 'android 4'))
		.pipe(gulp.dest('dist/styles/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/styles/'))
		.pipe(livereload())
	// .pipe(notify({ message: '生成并压缩css done....' }));
});

gulp.task('scripts', function () {
	return gulp.src('src/scripts/**/*.js')
		.pipe(debug({
			title: 'js打包:'
		}))
		// .pipe(jshint('.jshintrc'))
		// .pipe(jshint.reporter('default'))
		// .pipe(concat('main.js'))
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(livereload())
	// .pipe(notify({ message: '生成并压缩js done....' }));
});

gulp.task('images', function () {
	return gulp.src('src/images/**')
		// .pipe(debug({title: '普通压缩:'}))
		// .pipe(cache(imagemin({ 
		// 	optimizationLevel: 5,
		// 	progressive: true,
		// 	interlaced: true,
		// 	svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
		// 	use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
		// })))
		.pipe(gulp.dest('dist/images'))
		.pipe(livereload())
	// .pipe(notify({ message: '图片整理并压缩 done....' }));
});

//压缩图片 - tinypng
gulp.task('tinypng', function () {
	return gulp.src('src/images/**/*.{png,jpg,jpeg}')
		.pipe(debug({
			title: 'tinypng压缩:'
		}))
		.pipe(tinypng(config.tinypngApi))
		.pipe(gulp.dest('./dist/images'));
});

gulp.task('html', function () {
	return gulp.src('src/*.html')
		.pipe(debug({
			title: 'html打包:'
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(livereload())
	// .pipe(notify({ message: '生成并整理Html done....' }));
});

//清除所有的生成文件
gulp.task('clean', function () {
	return gulp.src(['dist'], {
		read: false
	})
		.pipe(clean());
});

gulp.task('webserver', function () {
	return gulp.src('./dist/') // 服务器目录（./代表根目录）
		.pipe(webserver({
			host: config.localServer.host,
			port: config.localServer.port,
			livereload: true, // 启用LiveReload
			open: true, // 服务器启动时自动打开网页
			directoryListing: false
		}));
});

gulp.task('watch', function () {
	livereload.listen();
	// Watch .scss files
	watch('src/styles/**/*.scss', function (file, cb) {
		gulp.run('styles', function () {
			// foal.run(upload(file.path), cb);
			livereload.changed(file.path);
		})
	});
	// Watch .js files
	watch('src/scripts/**/*.js', function (file, cb) {
		gulp.run('scripts', function () {
			// foal.run(upload(file.path), cb);
			livereload.changed(file.path);
		})
	});
	// Watch image files
	watch('src/images/**', function (file, cb) {
		gulp.run('images', function () {
			// foal.run(upload(file.path), cb);
			livereload.changed(file.path);
		});
	});
	// Watch html files
	watch('src/*.html', function (file, cb) {
		gulp.run('html', function () {
			// foal.run(upload(file.path), cb);
			livereload.changed(file.path);
		});
	});
});

// 打包文件
gulp.task('zip', function () {
	function checkTime(i) {
		if (i < 10) {
			i = "0" + i
		}
		return i
	}
	var d = new Date();
	var year = d.getFullYear();
	var month = checkTime(d.getMonth() + 1);
	var day = checkTime(d.getDate());
	var hour = checkTime(d.getHours());
	var minute = checkTime(d.getMinutes());

	return gulp.src('./dist/**')
		.pipe(debug({
			title: '打包成zip:'
		}))
		.pipe(zip(config.project + '-' + year + month + day + '-' + hour + minute + '.zip'))
		.pipe(gulp.dest('./'));
});

//上传到远程服务器任务，使用foal定义上传任务
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
			}));
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
			}));
	}
});

// 默认任务
gulp.task('default', function () {
	gulp.run('styles');
	gulp.run('scripts');
	gulp.run('images');
	gulp.run('html');
	gulp.run('webserver');
	gulp.run('watch');
});

gulp.task('build', ['clean'], function () {
	gulp.run('styles');
	gulp.run('scripts');
	gulp.run('images');
	gulp.run('html');
});

// 提交代码执行的任务
gulp.task('build2', ['clean'], function () {
	gulp.run('styles');
	gulp.run('scripts');
	gulp.run('tinypng');
	gulp.run('html');
	gulp.run('zip');
});
