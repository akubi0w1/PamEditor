var gulp = require('gulp'),
    sass = require('gulp-sass'),
    header = require('gulp-header'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    pkg = require('./package.json'),
    browserify = require('browserify'),
    babel = require('gulp-babel')

var banner = ["/**",
" * <%= pkg.name %> v<%= pkg.version %>",
" * Copyright <%= pkg.company %>",
" * @link <%= pkg.homepage %>",
" * @license <%= pkg.license %>",
" */",
""].join("\n");

// browserify(files, [options]) = browserifyのインスタンス作成
// b.bundle() = ファイルをbundleする．一つのjsファイルにまとめてくれる
// browserify [file] > ? と同じかな
function taskBrowserify(opts) {
    return browserify("./src/js/pam-editor.js", opts)
            .bundle()
}

// browserify
gulp.task("browserify:debug", function(){
    return taskBrowserify({debug:true, standalone:"PamEditor"})
            .pipe(source("pam-editor.debug.js")) // vinylっていうオブジェクト(stream)に変換
            .pipe(buffer()) // streamから，bufferに変換
            .pipe(header(banner, {pkg:pkg})) // headerを貼って
            .pipe(gulp.dest("./debug/")); // 書き出し
});

gulp.task("browserify", function(){
    return taskBrowserify({standalone: "PamEditor"})
            .pipe(source("pam-editor.js"))
            .pipe(buffer())
            .pipe(header(banner, {pkg:pkg}))
            .pipe(gulp.dest("./debug/"))
});

gulp.task("scripts", 
    gulp.series("browserify:debug",
        gulp.series("browserify",
            function() {
                var js_files = ["./debug/pam-editor.js"];

                return gulp.src(js_files)
                        .pipe(babel({
                            presets: ['@babel/env']
                        }))
                        .pipe(concat("pam-editor.min.js")) // js_filesのものを，pam-editor.min.jsに連結
                        .pipe(uglify()) // jsのminify化
                        .pipe(buffer())
                        .pipe(header(banner, {pkg:pkg}))
                        .pipe(gulp.dest("./dist/"))
            }
        )
    )
);

gulp.task("babel", function(){
    return gulp.src("./debug/pam-editor.js")
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(gulp.dest("./dist/"));
});

// compile sass
gulp.task("sass", function(){
    return (
        gulp.src("src/sass/**/*.scss")
        .pipe(sass({outputStyle:"expanded"}))
        .pipe(gulp.dest("./src/css"))
    );
});

// watch: compile sass
gulp.task("sass-watch", function(){
    return gulp.watch("src/sass/**/*.scss", function(){
        return (
            gulp.src("src/sass/**/*.scss")
            .pipe(sass({outputStyle:"expanded"}).on("error", sass.logError))
            .pipe(gulp.dest("./src/css"))
        );
    });
});

// 


// gulp.task("browserify", () => {
//     return (
//         browserify('./src/js/pam-editor.js')
//         .bundle()
//         .pipe(source('bundle.js'))
//         .pipe(gulp.dest('./dest/assets/js/'))
//     );
// });
