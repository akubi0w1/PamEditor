var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("sass", function(){
    return (
        gulp.src("src/sass/**/*.scss")
        .pipe(sass({outputStyle:"expanded"}))
        .pipe(gulp.dest("./src/css"))
    );
});

gulp.task("sass-watch", function(){
    return gulp.watch("src/sass/**/*.scss", function(){
        return (
            gulp.src("src/sass/**/*.scss")
            .pipe(sass({outputStyle:"expanded"}).on("error", sass.logError))
            .pipe(gulp.dest("./src/css"))
        );
    });
});
