// including plugins
var gulp = require('gulp')
var minifyCSS = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')
var gp_concat = require('gulp-concat')
var gp_rename = require('gulp-rename')
var gp_uglify = require('gulp-uglify')
var path = require('path')

gulp.task('css-main', function(){
    return gulp.src(
            [
                './public/css/bootstrap.min.css',
                './public/css/icons.css',
                './public/css/metismenu.min.css',
                './public/css/style.css'
            ]
        )
        .pipe(minifyCSS())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gp_concat('style.min.css'))
        .pipe(gulp.dest('./public/dist/css/'))
})

gulp.task('copy-fonts', function(){
    return gulp.src(
            ['./public/fonts/**']
        )
        .pipe(gulp.dest('./public/dist/fonts/'))
})

gulp.task('style', gulp.series(gulp.parallel('css-main', 'copy-fonts')) , function(){})

//global vendor js scripts
gulp.task('js-vendor', function(){
    return gulp.src(
            [
                './public/js/jquery.min.js',
                './public/js/popper.min.js',
                './public/js/bootstrap.min.js',
                './public/js/metisMenu.min.js',
                './public/js/waves.js',
                './public/js/jquery.slimscroll.js'
            ]
        )
        .pipe(gp_concat('vendor.min.js'))
        .pipe(gulp.dest('./public/dist/js/'))
        .pipe(gp_rename('vendor.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/dist/js/'))
});

// app javascript
gulp.task('js-app', function(){
    return gulp.src(
            [
                './public/js/jquery.core.js',
                './public/js/jquery.app.js'
            ]
        )
        .pipe(gp_concat('app.min.js'))
        .pipe(gulp.dest('./public/dist/js/'))
        .pipe(gp_rename('app.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/dist/js/'))
});

// dashboard/ome javascript
gulp.task('js-dashboard', function(){
    return gulp.src(
            [
                './public/plugins/flot-chart/jquery.flot.min.js',
                './public/plugins/flot-chart/jquery.flot.time.js',
                './public/plugins/flot-chart/jquery.flot.tooltip.min.js',
                './public/plugins/flot-chart/jquery.flot.resize.js',
                './public/plugins/flot-chart/jquery.flot.pie.js',
                './public/plugins/flot-chart/jquery.flot.crosshair.js',
                './public/plugins/flot-chart/curvedLines.js',
                './public/plugins/flot-chart/jquery.flot.axislabels.js',
                './public/pages/jquery.dashboard.init.js',

            ]
        )
        .pipe(gp_concat('dashboard.min.js'))
        .pipe(gulp.dest('./public/dist/pages/dashboard/js/'))
        .pipe(gp_rename('dashboard.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/dist/pages/dashboard/js/'))
});

gulp.task('js', gulp.series(gulp.parallel('js-vendor', 'js-app', 'js-dashboard')) , function(){})

gulp.task('prod', gulp.series(gulp.parallel('style', 'js')) , function(){})
gulp.task('default', gulp.series(gulp.parallel('style', 'js')) , function(){})
