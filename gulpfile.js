
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

/**
 * 压缩WYX.js为WYX.min.js
 */
gulp.task("default", function() {
    gulp.src("WYX.js")
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest("."));
});


