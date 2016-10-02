'use strict';
const gulp = require('gulp'),
	watchify = require('watchify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	stylus = require('gulp-stylus'),
	notifier = require('node-notifier'),
	inject = require('gulp-inject'),
	htmlmin = require('gulp-htmlmin'),
	conf = require('./conf');

const path = conf.path;

module.exports = {
	/**
	 * generate style
	 */
	generateStyle(src, target, mode, hash) {
		target = target.replace(/\//g, '_');
		if (src) {
			if (mode === 'build') {
				return gulp.src(src)
						.pipe(stylus({compress: true}))
						.pipe(rename(`${target}.min.${hash}.css`))
						.pipe(gulp.dest(`${path.dist.style}`));
			} else {
				return gulp.src(src)
						.pipe(stylus())
						.pipe(rename(`${target}.css`))
						.pipe(gulp.dest(`${path.src.static}/bundle/styles`));
			}
		}
	},


	/**
	 * generate script
	 */
	generateScript(src, target, mode, hash) {
		target = target.replace(/\//g, '_');
		if (src) {
			if (mode === 'build') {
				return gulp.src(src)
						.pipe(concat(`${target}.js`))
						.pipe(rename({suffix: '.min.' + hash}))
						.pipe(uglify())
						.pipe(gulp.dest(`${path.dist.script}`));
			} else {
				return gulp.src(src)
						.pipe(concat(`${target}.js`))
						.pipe(gulp.dest(`${path.src.static}/bundle/scripts`));
			}
		}
	},


	/**
	 * inject to html
	 */
	injectHTML(targetHTML, injectName, mode, hash) {
		injectName = injectName.replace(/\//g, '_');

		let viewPath;
		let cssPath;
		let jsPath;

		if (mode === 'build') {
			viewPath = path.dist.view;
			cssPath = `${path.dist.style}/${injectName}.min.${hash}.css`;
			jsPath =`${path.dist.script}/${injectName}.min.${hash}.js`;
		} else {
			viewPath = path.src.view;
			cssPath = `${path.src.static}/bundle/styles/${injectName}.css`;
			jsPath = `${path.src.static}/bundle/scripts/${injectName}.js`;
		}

		let targetObject = gulp.src(`${viewPath}/${targetHTML}.html`);
		let sourcesCss = gulp.src(cssPath, {read: false});
		let sourcesJs = gulp.src(jsPath, {read: false});

		// fix sub folder bug
		let dest = viewPath;
		const index = targetHTML.lastIndexOf('/');
		if(index !== -1) {
			dest += '/' + targetHTML.substring(0, index);
		}

		// inject
		const p = targetObject.pipe(inject(sourcesCss, {
					addRootSlash: false,
					transform: (filePath) => {
						const index = filePath.indexOf('/' + path.static);
						return `<link rel="stylesheet" href="${filePath.substring(index)}"/>`;
					}
				}))
				.pipe(gulp.dest(dest))
				.pipe(inject(sourcesJs, {
					addRootSlash: false,
					transform: (filePath) => {
						const index = filePath.indexOf('/' + path.static);
						return `<script src="${filePath.substring(index)}"></script>`;
					}
				}));

		if(mode === 'build') {
			// minify html
			p.pipe(htmlmin({
				collapseWhitespace: true,
				removeComments: true,
				minifyJS: true
			})).pipe(gulp.dest(dest));
		} else {
			p.pipe(gulp.dest(dest));
		}
	}
};