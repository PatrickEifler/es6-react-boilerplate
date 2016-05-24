require('es6-promise').polyfill();
var gulp = require("gulp");
var webpack = require("gulp-webpack");
var uglify = require("gulp-uglify");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

//PATHS
var SRC_PATH = "src/";
var DIST_PATH = "dist/"

//WEBPACK CONF
var WEBPACK_CONF = "./webpack.config.js";

//FILES
var stylesheets = "stylesheets/**/*.sass";
var js_files = SRC_PATH+"**/*.js";
var jsx_files = SRC_PATH+"**/*.jsx";

gulp.task("webpack", function() {
  console.log("run [webpack] - task to create bundle - /dist/bundle.js");

  return gulp.src(WEBPACK_CONF)
    .pipe(webpack(require(WEBPACK_CONF)))
    .pipe(gulp.dest(DIST_PATH));
});

gulp.task('compress_bundle', function() {
  var isProduction = process.env.NODE_ENV === "production" ? true : false;

  if(isProduction) {
    console.log("run [compress_bundle] - task to minify and drop console logging - /dist/min/bundle.js");
  } else {
    console.log("Build bundle - /dist/bundle.js");
  }

  return gulp.src(WEBPACK_CONF)
    .pipe(webpack(require(WEBPACK_CONF)))
    .pipe(gulp.dest(DIST_PATH))
    .pipe(uglify({
      compress: {
        drop_console: isProduction
      }
    }))
    .pipe(gulp.dest(DIST_PATH+'min/'));
});

gulp.task('sass', function() {
  var input = "stylesheets/base.sass";
  var output = DIST_PATH+"css";
  var sassOptions = {
      indentedSyntax: true,
      errLogToConsole: true,
      outputStyle: 'extended'
    };

  return gulp.src(input)
    .pipe(sass(sassOptions))
    .pipe(autoprefixer())
    .pipe(gulp.dest(output));
});

gulp.task('compress_sass', function() {
  var input = "stylesheets/base.sass";
  var output = DIST_PATH+"/min/";
  var sassOptions = {
      indentedSyntax: true,
      errLogToConsole: true,
      outputStyle: 'compressed'
    };

  return gulp.src(input)
    .pipe(sass(sassOptions))
    .pipe(autoprefixer())
    .pipe(gulp.dest(output));
});

gulp.task("watch", function() {
  gulp.watch(
    [
      "!dist/*.js", //exclude dist
      "!dist/**/*.css",
      js_files,
      jsx_files,
      stylesheets
    ],
    ["webpack", "sass"]
  );
});

gulp.task('setProduction', function() {
  console.log("NODE_ENV CURRENTLY IS: ", process.env.NODE_ENV);
  process.env.NODE_ENV = "production";
  console.log("SET NODE_ENV TO: ", process.env.NODE_ENV);
});

gulp.task('setDevelopment', function() {
  console.log("NODE_ENV CURRENTLY IS: ", process.env.NODE_ENV);
  process.env.NODE_ENV = "development";
  console.log("SET NODE_ENV TO: ", process.env.NODE_ENV);
});

gulp.task('env', function() {
  console.log("NODE_ENV:", process.env.NODE_ENV);
});

//BUILD WEBPACK BUNDLE COMPILE SASS AND WATCH
gulp.task("default", ["webpack", "sass", "watch"]);

//COMPRESS BUNDLE
gulp.task("deploy", ["setProduction", "compress_bundle", "compress_sass"]);
