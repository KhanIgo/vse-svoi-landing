var 
    isProd = false,
    gulp = require('gulp'),
    gutil = require("gulp-util"),
    webpack = require("webpack"),
    webpackStream = require('webpack-stream'),
    connect = require('gulp-connect-php'),
    bs = require('browser-sync').create(),
    stream = bs.stream,
    reload = bs.reload,
    sass = require('gulp-sass'),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    prefixer = require("gulp-autoprefixer"),
    sourcemaps = require("gulp-sourcemaps"),
    pug = require("gulp-pug"),
    del = require("del"),
    rs = require("run-sequence"),
    concatFilenames = require('gulp-concat-filenames'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    rename = require("gulp-rename"),
    args = require('yargs').argv,
    cleanCSS = require('gulp-clean-css'),
    fileInclude = require('gulp-file-include'),
    wpcg = require('./webpack'),
    minifyOpt = { ext: { min: '.js' }, noSource: true }
    ;

    require("@babel/polyfill");

    const path = {
        src: './src',
        // target: './dist',
        target: './../public_html/wp-content/themes/infographer/_zest/assets',
        // target: './../Crazy-studio/iComplect/public_html/wp-content/themes/i-comp/assets/',
        // target: './html',
    };
    path.srcJs = path.src+'/js';
    path.srcCss = path.src+'/scss';
    path.srcImg = path.src+'/images';
    path.targetJs = path.target+'/js';
    path.targetCss = path.target+'/css';
    path.targetImg = path.target+'/images';
    path.srcFonts = path.src +'/fonts';
    path.targetFonts = path.target +'/fonts';

gulp.task('html', function(done) {
     gulp.src( path.src +'/*.html' )
          .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
          }))
          .pipe(gulp.dest( path.target ));
    done();
});


gulp.task('scssCompile', function (done) {
  
      if(isProd){
          gulp.src( path.srcCss +'/style.scss')
          .pipe(sass())
          .pipe(cleanCSS({compatibility: 'ie8'}))
          .pipe(gulp.dest( path.targetCss ));
      }
      else{
          gulp.src( path.srcCss+'/style.scss')
          .pipe(plumber({
              errorHandler: notify.onError(function (err) {
                  return {
                      title: 'Styles',
                      message: err.message
                  }
              })
          }))
          .pipe(sourcemaps.init())
          .pipe(sass())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest( path.targetCss ))
          .pipe(stream());
      }
      
      done();
  });
gulp.task('scss', gulp.series('scssCompile' ) );

gulp.task('webpack', function( done )  {
    const webpackConfig  = wpcg.getWebpackConfig( isProd );
    // console.log('webpackConfig', webpackConfig);
    // if(isProd){ webpackConfig.mode = 'production'; }
  gulp.src( path.srcJs+'/index.js')
      .pipe( webpackStream(webpackConfig) )
      .pipe(gulp.dest( path.targetJs ));
      done();
});
gulp.task('js', gulp.series('webpack'));



gulp.task('clean:html', function (done) {
    del( path.target +'/*.html');
    done();
});
gulp.task('clean:js', function (done) {
    del( path.targetJs );
    done();
});
gulp.task('clean:css', function (done) {
    del( path.targetCss );
    done();
});
gulp.task('clean:img', function (done) {
    del( path.targetImg );
    done();
});
gulp.task('clean:font', function (done) {
    del( path.targetFonts );
    done();
});
gulp.task('clean', gulp.parallel('clean:html', 'clean:css', 'clean:js', 'clean:img', 'clean:font'));



gulp.task('copy:img', function (done) {
  gulp.src( path.srcImg +'/**/*.*')
      .pipe(gulp.dest( path.targetImg ));
    
  gulp.src( path.srcCss +'/img/**/*.*')
      .pipe(gulp.dest( path.targetCss+'/img' ));

  done();
});

gulp.task('copy:font', function (done) {
  gulp.src( path.srcFonts +'/**/*.*')
      .pipe(gulp.dest( path.targetFonts ));
  done();
});

gulp.task('copy', gulp.parallel('copy:img', 'copy:font'));



gulp.task('watchers', function (done) {
    // gulp.watch( path.src + '/**/*.html', gulp.series('html') );
    gulp.watch( path.srcCss + '/**/*.scss', gulp.series('scss') );
    gulp.watch( path.srcJs + '/**/*.js', gulp.series('js') );
    gulp.watch( path.srcImg + '/**/*.*', gulp.series('copy:img') );
    gulp.watch( path.srcFonts + '/**/*.*', gulp.series('copy:font') );
    
    // gulp.watch( path.src +'/images/**/*.*', gulp.series('copy:img') );
    // gulp.watch( path.src +'/fonts/**/*.*', gulp.series('copy:fonts') );

    done();
});
    
gulp.task('serve', function(done) {
  connect.server({
    port: 8008, //default
    // hostname: '127.0.0.1' //default
    base: path.target,
    open: true   
  });
    done();
});


gulp.task(
    'server',
    gulp.series(
        // gulp.parallel('html', 'scss', 'js', 'copy:fonts', 'copy:img', 'copy:libs'),
        gulp.parallel('html', 'scss', 'js', 'copy:img', 'copy:font'),
        // gulp.parallel('scss', 'js', 'copy:img', 'copy:font'),
        // gulp.parallel('scss', 'js'),
        // gulp.parallel('html', 'scss', 'js', 'copy'),
        // gulp.parallel('scss', 'js', 'copy'),
        'watchers',
        // 'serve'
    )
);
  

gulp.task('setIsProd', function(done) { isProd = true; done(); });
gulp.task('build', gulp.series('setIsProd', 'scss', 'js') );

// gulp.task('default', gulp.series('scss', 'js', 'copy:img', 'copy:font'));
// gulp.task('default', gulp.series('clean', 'server'));
gulp.task('default', gulp.series('server'));

