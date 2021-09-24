
let project_folder = "dist";
let sourse_folder = "src";
let modules_folder = "node_modules";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/style",
        js: project_folder + "/js",
        img: project_folder + "/images",
    },
    src: {
        html: sourse_folder + "/**/*.html",
        css: sourse_folder + "/sass/index.scss",
        js: sourse_folder + "/js/script.js",
        img: sourse_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
        // mod: modules_folder + [
        //     "/jquery/dist/jquery.min.js",
        //     "/slick-carousel/slick/slick.min.js"
        // ],
    },
    watch: {
        html: sourse_folder + "/**/*.html",
        css: sourse_folder + "/sass/**/*.scss",
        js: sourse_folder + "/js/**/*.js",
        img: sourse_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp');
let gulp = require('gulp');

let browsersync = require('browser-sync').create();
let sass = require('gulp-sass')(require('sass'));
let fileinclude = require('gulp-file-include');
let babel = require('gulp-babel');
let concat = require('gulp-concat');
let jquery = require('jquery');
//let autoprefixer = require('gulp-autoprefixer');

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        notify: false,
        open: true,
        cors: true,
        ui: false
    })
}

function images() {
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function style() {
    return src(path.src.css)
        .pipe(fileinclude())
        //.pipe(autoprefixer({ cascade: false }))
        .pipe(sass().on('error', sass.logError))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function scriptsModLibs() {
    return src([
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/slick-carousel/slick/slick.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.min.js"
    ])
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(concat('libs.min.js'))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function scripts() {
    return src(path.src.js)
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], style)
    gulp.watch([path.watch.js], scripts)
    gulp.watch([path.watch.img], images)
}

let build = gulp.series(html, style, scripts, images, scriptsModLibs);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.scripts = scripts;
exports.style = style;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

