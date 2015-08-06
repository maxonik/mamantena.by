var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var affected = require('gulp-jade-find-affected');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var wiredep = require('wiredep');
var merge = require('merge-stream');
var spritesmith = require('gulp.spritesmith');
var del = require('del');

var spriteFolder = 'sprite-images';

gulp.task('test', function() {
    return console.log(wiredep());
});


gulp.task('jade', function() {
    gulp.src('app/*.jade')
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe(affected())
        .pipe($.cached('linting'))
        // jade will only get (and compile) the files in your base directory which have been affected by the changed file
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('jade-template', function() {
    gulp.src('app/*.jade')
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe(affected())
        // jade will only get (and compile) the files in your base directory which have been affected by the changed file
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    $.watch('app/*.jade', function() {
        gulp.start('jade');
    });

    $.watch(['app/layouts/*.jade', 'app/includes/**/*.jade'], function() {
        gulp.start('jade-template');
    });

    // watch for changes
    gulp.watch([
        'dist/*.html',
        'dist/css/**/*.css',
        '!dist/css/**/main.css',
        'app/js/**/*.js',
        'app/images/**/*.{png,jpg,jpeg,gif,svg}',
        'app/fonts/**/*.*'
    ], {
        interval: 800
    }).on('change', reload);

    gulp.watch('app/**/*.scss', {
        interval: 300
    }, ['sass']);
    gulp.watch('app/css/**/*.css', {
        interval: 300
    }, ['css']);
    gulp.watch('app/js/**/*.js', {
        interval: 300
    }, ['js']);
    gulp.watch('app/fonts/**/*.*', {
        interval: 300
    }, ['fonts']);
    gulp.watch([
        'app/images/**/*.{png,jpg,jpeg,gif,svg}',
        '!app/images/' + spriteFolder + '/*.*',
        // '!app/images/bg/*.*'
    ], {
        interval: 300
    }, ['images']);
    gulp.watch('app/images/' + spriteFolder + '/*.*', {
        interval: 300
    }, ['sprites']);
});

gulp.task('images', function() {
    return gulp.src([
            'app/images/**/*.{png,jpg,jpeg,gif,svg}',
            '!app/images/sprite-images',
            '!app/images/sprite-images/**'
        ])
        // .pipe($.changed('dist/images'))
        // .pipe($.imagemin())
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*.*')
        .pipe($.changed('dist/fonts'))
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('js', function() {
    return gulp.src(['app/js/**/*.js', '!app/js/lib/'])
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.concat('script.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('css', function() {
    return gulp.src('app/css/**/*.css')
        // .pipe($.ignore.exclude('app/css/**/*.min.css'))
        // .pipe($.csso())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('sass', function() {
    return gulp.src('app/scss/main.scss')
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        // .pipe(through(function() {
        //     this.emit("error", new Error("Something happend: Error message!"))
        // }))
        // .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested', // libsass doesn't support expanded yet
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.postcss([
            require('autoprefixer-core')({
                browsers: ['last 1 version']
            })
        ]))
        // .pipe($.csso())
        // .pipe($.sourcemaps.write())
        // .pipe($.rename('mobile.css'))
        .pipe(gulp.dest('dist'))
        .pipe(reload({
            stream: true
        }));
});

// inject bower components
// gulp.task('bower', function () {
//   gulp.src(['app/includes/**/*.jade', 'app/layouts/*.jade'], { base: 'app' })
//     .pipe(wiredep({
//         exclude: [
//           'bower_components/slick.js/slick/slick.css',
//           'bower_components/slick.js/slick/slick-theme.css',
//           'bower_components/foundation/css/foundation.css',
//           'bower_components/foundation/js/foundation.js'
//           ],
//         ignorePath: /^(\.\.\/)/
//     }))
//     .pipe(gulp.dest('app'));
// });


gulp.task('bower', ['vendor-scripts', 'vendor-css'], function() {

    return gulp.src(['app/includes/**/*.jade', 'app/layouts/*.jade'], {
            base: 'app'
        })
        .pipe(wiredep.stream({
            exclude: [
                'bower_components/slick.js/slick/slick.css',
                'bower_components/slick.js/slick/slick-theme.css',
                'bower_components/foundation/css/foundation.css',
                'bower_components/foundation/js/foundation.js'
            ],
            // ignorePath: /^(\.\.\/)/,
            // fileTypes: {
            //   jade: {
            //     replace: {
            //       js: function(filePath) {
            //         return 'script(src="' + 'js/vendor/' + filePath.split('/').pop() + '")';
            //       },
            //       // css: function(filePath) {
            //       //   return '<link rel="stylesheet" href="' + 'vendor/' + filePath.split('/').pop() + '"/>';
            //       // }
            //     }
            //   }
            // },
            // overrides: {
            //     waypoints: {
            //       main: ["lib/jquery.waypoints.min.js"],
            //     },
            //     jquery: {
            //       main: ["dist/jquery.min.js"],
            //     }
            // }
        }))

    // .pipe(plugins.inject(
    //   gulp.src(['build/src/**/*.js'], { read: false }), {
    //     addRootSlash: false,
    //     transform: function(filePath, file, i, length) {
    //       return '<script src="' + filePath.replace('build/', '') + '"></script>';
    //     }
    //   }))

    // .pipe(plugins.inject(
    //   gulp.src(['build/assets/**/*.css'], { read: false }), {
    //     addRootSlash: false,
    //     transform: function(filePath, file, i, length) {
    //       return '<link rel="stylesheet" href="' + filePath.replace('build/', '') + '"/>';
    //     }
    //   }))

    .pipe(gulp.dest('app'));
});

gulp.task('vendor-scripts', function() {
    // return gulp.src(wiredep().js)
    //     .pipe(gulp.dest('dist/js/vendor'));
});

gulp.task('vendor-css', function() {
    // return gulp.src(wiredep().css)
    //   .pipe(gulp.dest('dist/vendor'));
});



// var templater = require('spritesheet-templates');

gulp.task('sprites', function() {

    // Generate our spritesheet
    var spriteData = gulp.src('app/images/' + spriteFolder + '/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            imgPath: '../images/sprite.png',
            cssVarMap: function(sprite) {
                sprite.name = 'sprite-' + sprite.name;
            }
        }));

    spriteData.img
        // .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));

    spriteData.css
        // .pipe(csso())
        .pipe(gulp.dest('app/scss/utilities'));
});


gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

gulp.task('assets', function() {
    gulp.src([
            'app/favicon.*'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['images', 'js', 'jade', 'jade-template', 'sprites', 'sass', 'css', 'fonts', 'bower', 'assets'], function() {
    browserSync({
        notify: false,
        port: 9000,
        open: false,
        server: {
            baseDir: ['dist'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });
    gulp.start(['watch']);
});

gulp.task('compress', function() {
    return gulp.src('dist/**/*.*')
        .pipe($.zip('archive.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean'], function() {
    gulp.start(['images', 'js', 'jade', 'jade-template', 'sprites', 'sass', 'css', 'fonts', 'bower', 'assets', 'compress']);
});

gulp.task('default', ['serve']);
