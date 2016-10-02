'use strict';
require('shelljs/global');

const gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin'),
	utils = require('./utils'),
	conf = require('./conf');

let tasks = [];
const hash = Math.ceil(Date.now()/1000);
const path = conf.path;

/** clean **/
const cleanTask = 'clean-build';
gulp.task(cleanTask, () => {
	rm('-rf', path.dist.root);
	mkdir('-p', path.dist.static);
	mkdir('-p', path.dist.view);
	cp('-R', `${path.src.view}/*`, `${path.dist.view}`); // move views
	cp('-R', `${path.src.static}/*`, `${path.dist.static}`); // move static
});

/************************************************************
 * build core
 * **********************************************************/

const coreTask = 'core-build';
const coreCleanTask = 'core-clean-build';
const coreHtmlTask = 'core-html-build';
const coreStyleTask = 'core-style-build';
const coreScriptTask = 'core-script-build';

/** core clean **/
gulp.task(coreCleanTask, () => {
	rm('-rf', `${path.dist.style}/${conf.core.name}.min.*.css`);
	rm('-rf', `${path.dist.script}/${conf.core.name}.min.*.js`);
});

/** move and minify component html **/
gulp.task(coreHtmlTask, function() {
	return gulp.src(`${path.dist.view}/components/*.html`)
			.pipe(htmlmin({
				collapseWhitespace: true,
				removeComments: true,
				minifyJS: true
			}))
			.pipe(gulp.dest(`${path.dist.view}/components`));
});

/** core css **/
gulp.task(coreStyleTask, () => {
	utils.generateStyle(conf.core.style, conf.core.name, 'build', hash);
});

/** core js **/
gulp.task(coreScriptTask, () => {
	return utils.generateScript(conf.core.script, conf.core.name, 'build', hash);
});

/** !!!! build core !!!! **/
gulp.task(coreTask, [coreCleanTask, coreHtmlTask, coreStyleTask, coreScriptTask], () => {
	// inject html
	utils.injectHTML(path.baseView, conf.core.name, 'build', hash);
});


/*******************************************************************
 * build page target
 ******************************************************************/
const targetTasks = [];
for(let target in conf.tasks) {
	if(conf.tasks.hasOwnProperty(target)) {
		const o = conf.tasks[target];
		const task = `${target}-build`;
		const cleanTask = `${target}-clean-build`;
		const styleTask = `${target}-style-build`;
		const scriptTask = `${target}-script-build`;

		/** target clean **/
		gulp.task(cleanTask, () => {
			const tmp = target.replace(/\//g, '_');
			rm('-rf', `${path.dist.static}/styles/${tmp}.min.*.css`);
			rm('-rf', `${path.dist.static}/scripts/${tmp}.min.*.js`);
			cp('-R', `${path.src.view}/${tmp}.html`, `${path.dist.view}`); // move views
		});

		/** target style **/
		gulp.task(styleTask, () => {
			return utils.generateStyle(o.style, target, 'build', hash);
		});

		/** target script **/
		gulp.task(scriptTask, () => {
			return utils.generateScript(o.script, target, 'build', hash);
		});

		/** !!!! build target !!!! **/
		gulp.task(task, [cleanTask, styleTask, scriptTask], () => {
			// inject html
			utils.injectHTML(target, target, 'build', hash);
		});

		// push to array
		targetTasks.push(task);
	}
}

// all tasks
tasks.push(cleanTask);
tasks.push(coreTask);
tasks = tasks.concat(targetTasks);

exports.tasks = tasks;