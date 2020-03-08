const gulp = require('gulp');
const sass = require('gulp-sass');
const header = require('gulp-header');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const pkg = require('./package.json');

const banner = ['/**',
' * <%= pkg.name %> v<%= pkg.version %>',
' * Copyright <%= pkg.company %>',
' * @link <%= pkg.homepage %>',
' * @license <%= pkg.license %>',
' */',
''].join('\n');

const paths = {
    allSrcJs: 'src/js/**/*.js',
    targetSrcJs: 'src/js/pam-editor.js',
    gulpFile: 'gulpfile.js',
    libDir: 'lib',
    distDir: 'dist',
};

// browserify(files, [options]) = browserifyのインスタンス作成
// b.bundle() = ファイルをbundleする．一つのjsファイルにまとめてくれる
// browserify [file] > ? と同じかな
function taskBrowserify(opts) {
    return browserify(paths.targetSrcJs, opts)
            .bundle();
}

// clean
gulp.task('clean', () =>
    del([
        paths.libDir,
        paths.distDir,
    ]),
);

// lint
gulp.task('lint', () =>
    gulp.src([
        paths.targetSrcJs,
        paths.gulpFile,
    ])
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
);

// build: babelする
gulp.task('build', gulp.series('lint', 'clean', () =>
    gulp.src(paths.targetSrcJs)
        .pipe(header(banner, { pkg }))
        .pipe(babel())
        .pipe(gulp.dest(paths.libDir))
));

// main: gen distribution
gulp.task('main', gulp.series('lint', 'clean', () =>
    taskBrowserify({ standalone: 'PamEditor' })
        .pipe(source(paths.targetSrcJs))
        .pipe(buffer())
        .pipe(babel())
        .pipe(concat('pam-editor.min.js'))
        .pipe(uglify()) // jsのminify化
        .pipe(header(banner, { pkg }))
        .pipe(buffer())
        .pipe(gulp.dest(paths.distDir))
));

// compile sass
gulp.task('sass', () =>
    gulp.src('src/sass/**/*.scss')
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(gulp.dest('./src/css'))
);

// watch: compile sass
gulp.task('sass-watch', () =>
    gulp.watch('src/sass/**/*.scss', () =>
        gulp.src('src/sass/**/*.scss')
            .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
            .pipe(gulp.dest('./src/css'))
));

// js変更監視
gulp.task('watch', () => {
    gulp.watch(paths.allSrcJs, gulp.task('main'));
});

gulp.task('default', gulp.series('main', 'watch'));
