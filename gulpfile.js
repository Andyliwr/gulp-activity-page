const path = require('path')
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const minifycss = require('gulp-minify-css')
const cssBeautify = require('gulp-cssbeautify')
const eslint = require('gulp-eslint')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const tinypng = require('gulp-tinypng')
// png 深度压缩
const rename = require('gulp-rename')
const zip = require('gulp-zip') // 打包
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const notify = require('gulp-notify')
const cache = require('gulp-cache')
const debug = require('gulp-debug')
const browserSync = require('browser-sync').create()
const sftp = require('gulp-sftp')
const ftp = require('gulp-ftp')
const foal = require('gulp-foal')(global) // task传参数
const watch = require('gulp-watch')
// 配置文件
const config = require('./config.json')
var reload = browserSync.reload

gulp.task('styles', function() {
  return gulp
    .src(['src/styles/**/*.scss', '!src/styles/**/_*.scss']) //会编译styles目录下的以scss结尾的scss文件
    .pipe(
      debug({
        title: 'CSS packing:'
      })
    )
    .pipe(
      sass({
        style: 'expanded'
      })
    )
    .pipe(autoprefixer('ios 6', 'android 4'))
    .pipe(
      cssBeautify({
        indent: '  ',
        openbrace: 'end-of-line',
        autosemicolon: true
      })
    )
    .pipe(gulp.dest('dist/styles/'))
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'))
    .pipe(reload({ stream: true }))
})

// 只有eslint通过了才经行script打包
gulp.task('scripts', ['lint'], function() {
  return gulp
    .src('src/scripts/**/*.js')
    .pipe(
      debug({
        title: 'JS packing:'
      })
    )
    .pipe(
      babel({
        presets: ['env']
        // plugins: ['transform-runtime']
      })
    )
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(reload({ stream: true }))
})

gulp.task('images', function() {
  return gulp
    .src('src/images/**')
    .pipe(gulp.dest('dist/images'))
    .pipe(reload({ stream: true }))
})

gulp.task('fonts', function() {
  return gulp
    .src('src/fonts/**')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(reload({ stream: true }))
})

// 压缩图片 - tinypng
gulp.task('tinypng', function() {
  return gulp
    .src('src/images/**/*.{png,jpg,jpeg}')
    .pipe(
      debug({
        title: 'tinypng:'
      })
    )
    .pipe(tinypng(config.tinypngApi))
    .pipe(gulp.dest('./dist/images'))
})

gulp.task('html', function() {
  return gulp
    .src('src/*.html')
    .pipe(
      debug({
        title: 'HTML packing:'
      })
    )
    .pipe(gulp.dest('dist/'))
    .pipe(reload({ stream: true }))
})

// 清除所有的生成文件
gulp.task('clean', function() {
  return gulp
    .src(['dist'], {
      read: false
    })
    .pipe(clean())
})

// 静态服务器
gulp.task('webserver', function() {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  })
  gulp.watch('src/styles/**/*.scss', ['styles'])
  gulp.watch('src/images/**', ['images'])
  gulp.watch('src/fonts/**', ['fonts'])
  gulp.watch('src/scripts/**/*.js', ['scripts'])
  gulp.watch('src/**/*.html', ['html'])
})

gulp.task('lint', () => {
  return gulp
    .src(['src/scripts/**/*.js', '!node_modules/**', '!dist/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

// 打包文件
gulp.task('zip', function() {
  function checkTime(i) {
    if (i < 10) {
      i = '0' + i
    }
    return i
  }
  var d = new Date()
  var year = d.getFullYear()
  var month = checkTime(d.getMonth() + 1)
  var day = checkTime(d.getDate())
  var hour = checkTime(d.getHours())
  var minute = checkTime(d.getMinutes())

  return gulp
    .src('./dist/**')
    .pipe(
      debug({
        title: '打包成zip:'
      })
    )
    .pipe(zip(config.project + '-' + year + month + day + '-' + hour + minute + '.zip'))
    .pipe(gulp.dest('./'))
})

// 上传到远程服务器任务，使用foal定义上传任务
foal.task('upload', function(filePath, cb) {
  if (config.upload.protocol === 'ftp' || config.upload.protocol === 'Ftp' || config.upload.protocol === 'FTP') {
    return gulp
      .src(filePath)
      .pipe(
        debug({
          title: 'ftp上传:'
        })
      )
      .pipe(
        ftp({
          host: config.upload.host,
          user: config.upload.user,
          pass: config.upload.password,
          port: config.upload.port,
          remotePath: config.upload.remotePath
        })
      )
  } else if (config.upload.protocol === 'sftp' || config.upload.protocol === 'Sftp' || config.upload.protocol === 'SFTP') {
    return gulp
      .src(filePath)
      .pipe(
        debug({
          title: 'sftp上传:'
        })
      )
      .pipe(
        sftp({
          host: config.upload.host,
          user: config.upload.user,
          pass: config.upload.password,
          port: config.upload.port,
          remotePath: config.upload.remotePath
        })
      )
  }
})

// 默认任务
gulp.task('default', function() {
  gulp.start('styles')
  gulp.start('scripts')
  gulp.start('images')
  gulp.start('fonts')
  gulp.start('html')
  gulp.start('webserver')
})

gulp.task('build', ['clean'], function() {
  gulp.start('styles')
  gulp.start('scripts')
  gulp.start('images')
  gulp.start('fonts')
  gulp.start('html')
})

// 提交代码执行的任务
gulp.task('build2', ['clean'], function() {
  gulp.start('styles')
  gulp.start('scripts')
  gulp.start('tinypng')
  gulp.start('fonts')
  gulp.start('html')
  gulp.start('zip')
})
