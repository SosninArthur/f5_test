import {src, dest, parallel, watch} from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import pug from 'gulp-pug'
import browserSync from 'browser-sync'
import autoprefixer from 'gulp-autoprefixer'
const sync = browserSync.create()


function prefixCSS() {
  return src('build/styles/*.css') // Укажите путь к вашим CSS файлам
    .pipe(autoprefixer())
    .pipe(dest('build')); // Укажите путь для сохранения обработанных файлов
}

function styles() {
    console.log('Компиляция SASS')
    return src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 5 version"],
      cascade: true
    }))
    .pipe(dest('build/styles/'))
    .pipe(browserSync.stream())
}

function pages() {
    console.log('Компиляция Pug')
    return src('src/pages/*.pug')
      .pipe(pug())
      .pipe(dest('build/'))
      .pipe(browserSync.stream())
}

function browserSyncJob() {
    browserSync.init({
      server: {
        baseDir: './build/',
        serveStaticOptions: {
          extensions: ['html'],
        },
      },
      port: 8080,
      ui: { port: 8081 },
      open: true,
    })

    watch('src/sass/*.scss', styles)
    watch('src/pages/*.pug', pages)
    watch('build/*.html', browserSync.reload)
    watch('build/styles/*.css', browserSync.reload)
}

export const pref = prefixCSS
export const server = browserSyncJob
export const build = parallel(styles, pages)