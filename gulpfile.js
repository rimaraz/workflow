var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSyc = require('browser-sync');
var reload = browserSyc.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');

var SOURCEPATH = {
	sassSource : 'src/scss/*.scss',
	htmlSource: 'src/*.html',
	jsSource: 'src/js/*.js'
};

var APPPATH = {
	root: 'app/',
	css: 'app/css',
	js: 'app/js'
}

gulp.task('clean-html', function(){
	return gulp.src(APPPATH.root + '/*.html',{ read: false, force: true})
		.pipe(clean());
})

gulp.task('clean-scripts', function(){
	return gulp.src(APPPATH.js + '/*.js',{ read: false, force: true})
		.pipe(clean());
})

gulp.task('sass', function(){
	var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	var sassFiles;

	sassFiles = gulp.src(SOURCEPATH.sassSource)
		.pipe(autoprefixer())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError));

		return merge(sassFiles, bootstrapCSS)
		.pipe(concat('app.css')) 
		.pipe(gulp.dest(APPPATH.css));
});

gulp.task('scripts', ['clean-scripts'], function(){
	gulp.src(SOURCEPATH.jsSource)
		.pipe(concat('main.js'))
		.pipe(browserify())
		.pipe(gulp.dest(APPPATH.js))
});

gulp.task('copy', ['clean-html'], function(){
	gulp.src(SOURCEPATH.htmlSource)
		.pipe(gulp.dest(APPPATH.root))
})

gulp.task('serve', ['sass'], function(){
	browserSyc.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'],{
		server: {
			baseDir: APPPATH.root
		}
	});
});

gulp.task('watch', ['serve','sass','copy','clean-html', 'clean-scripts', 'scripts'], function(){
	gulp.watch([SOURCEPATH.sassSource],['sass']);
	gulp.watch([SOURCEPATH.htmlSource],['copy']);
	gulp.watch([SOURCEPATH.jsSource],['scripts']);
});

gulp.task('default', ['watch']);