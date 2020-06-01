// Include gulp
var gulp = require('gulp');
var inject = require('gulp-inject');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concatCss = require('gulp-concat-css');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var webserver = require('gulp-webserver');

var paths = {
    components: {
        dev: 'app/components/**/*min.js',
        production: 'dist/bin/components/*min.js',
        notIncluded: '!app/components/jquery/dist/jquery.slim.min.js'
    },
    javascript: {
        dev: 'app/scripts/**/*.js',
        production: 'dist/bin/*min.js'
    },    
    css: {
        dev: ['app/styles/**/*.css', '!app/components/lodash/**/*.css', 'app/components/**/*.css'],
        production: 'dist/styles/*.css'
    },
    scss: {
        dev: 'app/styles/main.scss'
    },
    html: {
        dev: 'app/views/**/*.html',
        production: 'dist/views/**/*.html'
    }
}

// Lint Task
gulp.task('lint', function() {
    return gulp.src('app/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(livereload({ start: true }));
});

// Live reload html changes
gulp.task('html', function() {
    return gulp.src(paths.html.dev)
        .pipe(gulp.dest('dist/views'))
        .pipe(livereload({ start: true }));
});

gulp.task('slot', function() {
    return gulp.src("app/slot/**/*.js")
        .pipe(gulp.dest('dist/slot'));
});

gulp.task('images', function() {
    return gulp.src("app/images/*")
        .pipe(gulp.dest('dist/images'));
});

gulp.copy=function(src,dest){
    return gulp.src(src)
        .pipe(gulp.dest(dest));
};

gulp.task('copy-fonts', function(done) {
    gulp.copy("app/components/bootstrap/fonts/*", 'dist/fonts');
    gulp.copy("app/components/components-font-awesome/webfonts/*", 'dist/webfonts');
    gulp.copy("app/components/angular-ui-grid/fonts/*", 'dist/styles/fonts');    
    done();
});


// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(paths.scss.dev)
        .pipe(sass())        
        .pipe(concatCss("main.css"))
        .pipe(gulp.dest('dist/styles'))
        .pipe(gulp.dest('app/styles'))
        .pipe(livereload({ start: true }));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(paths.javascript.dev)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/bin'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/bin'))
        .pipe(livereload({ start: true }));
});

// Concatenate & Minify our Component Folder
gulp.task('components', function() {
    return gulp.src(paths.components.dev)
        .pipe(concat('component.js'))
        .pipe(gulp.dest('app/bin/components'))
        .pipe(rename('component.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/bin/components'))
        .pipe(livereload({ start: true }));
});

gulp.task('components-css', function() {
    return gulp.src(paths.css.dev)
        .pipe(concat('component.css'))
        .pipe(gulp.dest('dist/styles'));
});


// To create a webserver
gulp.task('webserver', function(done) {
    connect.server({
        root: 'app/',
        port: 8080,
        livereload: true
    });
    done();
});

// Watch Files For Changes & Live reload
gulp.task('watch', function(done) {
    livereload.listen({ start: true });
    gulp.watch(paths.javascript.dev, gulp.series('lint', 'scripts'));
    gulp.watch(paths.scss.dev, gulp.series('sass'));
    gulp.watch(paths.html.dev, gulp.series('html'));
    done();
});

// Doing dynamic injection of the dependencies in the index.html
gulp.task('devInjection', function () {    
   return gulp.src('app/index.html')         
         .pipe(gulp.dest('app'))  
         .pipe(inject(
             gulp.src(paths.css.dev.concat([paths.components.dev, paths.javascript.dev, paths.components.notIncluded]),
                 {read: false}), {relative: true}))
         .pipe(gulp.dest('app'));  
});

gulp.task('productionInjection',  function() {
    return gulp.src('app/index.html')        
        .pipe(inject(
            gulp.src([paths.css.production,paths.components.production, paths.javascript.production],
                     {read: false}), {relative: true}))
        .pipe(gulp.dest('dist'));
});


// // Default Task
// gulp.task('default', ['lint', 'sass', 'scripts', 'watch', 'webserver']);
gulp.task('default', gulp.series(gulp.parallel('lint', 'sass', 'scripts', 'watch', 'webserver'), function(done) { 
    // default task code here
    done();
}));


// // Dev Environment Task
// gulp.task('dev', ['sass', 'devInjection', 'watch', 'webserver' ]);
gulp.task('dev', gulp.series(gulp.series('sass', 'devInjection', 'watch', 'webserver'), function(done) { 
    // default task code here
    done();
}));

// // Production Environment Task
// gulp.task('production', ['sass', 'components', 'scripts', 'productionInjection', 'webserver']);
gulp.task('production', gulp.series(gulp.series('copy-fonts','images','slot','html', 'sass','components-css','components', 'scripts', 'productionInjection'), function(done) { 
    // default task code here
    done();
    process.exit();
}));
