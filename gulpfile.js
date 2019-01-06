// including plugins
var gulp = require('gulp')
var minifyCSS = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')
var gp_concat = require('gulp-concat')
var gp_rename = require('gulp-rename')
var gp_uglify = require('gulp-uglify')
var path = require('path')
var babel = require('gulp-babel')


// dashboard css
gulp.task('css-vendor', function(){
    return gulp.src(
            [
                // home page
                './public/css/bootstrap.min.css',
                './public/css/icons.css',
                './public/css/metismenu.min.css',
                './public/css/style.css',
                './public/plugins/spinkit/spinkit.css',
                './public/css/custom.css',
                './public/css/chat.css'
            ]
        )
        .pipe(minifyCSS())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gp_concat('vendor.min.css'))
        .pipe(gulp.dest('./public/dist/css/'))
})

// home css
gulp.task('css-pages-home', function(){
    return gulp.src(
            [
                // posts page
                './public/plugins/datatables/dataTables.bootstrap4.min.css',
                './public/plugins/datatables/dataTables.bootstrap4.min.css',
            ]
        )
        .pipe(minifyCSS())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gp_concat('home.min.css'))
        .pipe(gulp.dest('./public/dist/pages/home/css/'))
})

gulp.task('copy-fonts', function(){
    return gulp.src(
            ['./public/fonts/**']
        )
        .pipe(gulp.dest('./public/dist/fonts/'))
})

gulp.task('style', gulp.series(gulp.parallel('css-vendor', 'css-pages-home', 'copy-fonts')) , function(){})

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
                './public/js/jquery.app.js',
            ]
        )
        .pipe(gp_concat('app.min.js'))
        .pipe(gulp.dest('./public/dist/js/'))
        .pipe(gp_rename('app.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/dist/js/'))
});

// global custom javascript
gulp.task('js-global-custom', function(){
    return gulp.src(
            [
                './public/js/login.js'
            ]
        )
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(gp_concat('global-custom.min.js'))
        .pipe(gulp.dest('./public/dist/js/'))
        .pipe(gp_rename('global-custom.min.js'))
        .pipe(gp_uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest('./public/dist/js/'))
});

// dashboard/home javascript
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

// home javascript
gulp.task('js-pages-home', function(){
    return gulp.src(
            [
                './public/plugins/datatables/jquery.dataTables.min.js',
                './public/plugins/datatables/dataTables.bootstrap4.min.js',
                './public/plugins/datatables/dataTables.responsive.min.js',
            ]
        )
        .pipe(gp_concat('home.min.js'))
        .pipe(gulp.dest('./public/dist/pages/home/js/'))
        .pipe(gp_rename('home.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/dist/pages/home/js/'))
});

gulp.task('js', gulp.series(gulp.parallel('js-vendor', 'js-app', 'js-dashboard', 'js-pages-home', 'js-global-custom')) , function(){})

gulp.task('prod', gulp.series(gulp.parallel('style', 'js')) , function(){})
gulp.task('default', gulp.series(gulp.parallel('style', 'js')) , function(){})
