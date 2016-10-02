'use strict';
require('shelljs/global');

const gulp = require('gulp'),
	utils = require('./utils'),
    conf = require('./conf');

let tasks = [];
const hash = Math.ceil(Date.now()/1000);
const path = conf.path;

/**********************************************************
 * dev core
 * ********************************************************/

const coreTask = 'core-dev';
const coreStyleTask = 'core-style-dev';
const coreScriptTask = 'core-script-dev';

/** dev core css **/
gulp.task(coreStyleTask, () => {
	return utils.generateStyle(conf.core.style, conf.core.name, 'dev', hash);
});

/** dev core js **/
gulp.task(coreScriptTask, () => {
	return utils.generateScript(conf.core.script, conf.core.name, 'dev', hash);
});

/** !!!!!!!!!!!!!!!! dev core !!!!!!!!!!!!!!!! **/
gulp.task(coreTask, [coreStyleTask, coreScriptTask], () => {
	// inject html
	utils.injectHTML(path.baseView, conf.core.name, 'dev', hash);

	setTimeout(() => {
		// watch style
		gulp.watch(`${path.src.style}/**/*.styl`, [coreStyleTask]);
		// watch script
		for(const script of conf.core.script) {
			gulp.watch(script, [coreScriptTask]);
		}
	}, 50);
});

/*******************************************************************
 *  dev page target
 * *****************************************************************/
const targetTasks = [];
for(let target in conf.tasks) {
	if(conf.tasks.hasOwnProperty(target)) {
		const o = conf.tasks[target];
		const task = `${target}-dev`;
		const cleanTask = `${target}-clean-dev`;
		const styleTask = `${target}-style-dev`;
		const scriptTask = `${target}-script-dev`;

		/** target clean **/
		gulp.task(cleanTask, () => {
			const tmp = target.replace(/\//g, '_');
			rm('-rf', `${path.src.static}/bundle/styles/${tmp}.css`);
			rm('-rf', `${path.src.static}/bundle/scripts/${tmp}.js`);
		});

		/** target style **/
		gulp.task(styleTask, () => {
			return utils.generateStyle(o.style, target, 'dev', hash);
		});

		/** target script **/
		gulp.task(scriptTask, () => {
			return utils.generateScript(o.script, target, 'dev', hash);
		});

		/** !!!!!!!!!!!!!!!! dev target !!!!!!!!!!!!!!!! **/
		gulp.task(task, [cleanTask, styleTask, scriptTask], () => {
			// inject html
			utils.injectHTML(target, target, 'dev', hash);

			setTimeout(() => {
				// watch style
				if(o.style) {
					gulp.watch(o.style, [styleTask]);
				}
				// watch script
				if(o.script) {
					o.script.forEach((script) => {
						gulp.watch(script, [scriptTask]);
					});
				}
			}, 50);
		});

		// push to array
		targetTasks.push(task);
	}
}

// all tasks
tasks.push(coreTask);
tasks = tasks.concat(targetTasks);

exports.tasks = tasks;