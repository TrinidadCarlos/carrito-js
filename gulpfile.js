const {watch , src, dest, parallel, series} = require('gulp');
const webp = require('gulp-webp'); // npm install --save-dev gulp-webp
const sass = require('gulp-sass'); //npm install node-sass gulp-sass --save-dev
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer'); //npm install --save-dev gulp-autoprefixer
const sourcemaps = require('gulp-sourcemaps'); //npm install --save-dev gulp-sourcemaps
const concat = require('gulp-concat'); // npm install -D gulp-concat
const babel = require('gulp-babel'); //npm install --save-dev gulp-babel @babel/core @babel/preset-env
const imagemin = require('gulp-imagemin'); //npm install --save-dev gulp-imagemin
const terser = require('gulp-terser-js');  //npm install gulp-terser.js
// const { pipe } = require('stdout-stream');
const htmlmin = require('gulp-htmlmin'); //npm install --save-dev gulp-htmlmin


function minHTML() {
    return src('./src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('./build'));
}


function javascript(){
    return src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.js'))
        .pipe(terser( {sourceMap: {content:true} } ))
        .pipe(sourcemaps.write('.'))
        .pipe(dest ('./build/js'))
}

function imgWebp(){
    return src('./src/img/**/*')
     .pipe(webp())
     .pipe(dest('./build/img'))
}

function imgMini(){
    return src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(dest('./build/img'))
}

function scssToCss(){
    return src('./src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css'))
}

function observador(){
    watch('./src/*.html', minHTML);
    watch('./src/js/**/*.js', javascript);
    watch('./src/scss/**/*.scss', scssToCss);
    //watch('./src/img/**/*', imgWebp);
    //watch('./src/img/**/*', imgMini);
}

exports.minHTML = minHTML;
exports.javascript = javascript;
exports.imgWebp = imgWebp;
exports.imgMini = imgMini;
exports.scssToCss = scssToCss;

exports.default = series(javascript, imgWebp, imgMini, scssToCss, minHTML,  observador)
