'use strict';

const gulp = require('gulp');
const notifier = require('node-notifier');
const devTasks = require('./webapp/build/dev').tasks;
const buildTasks = require('./webapp/build/prod').tasks;

/*************************** developement ************************/
gulp.task('dev', devTasks, () => {
    notifier.notify({ message: `Development is ready` });
});

/*************************** production ***************************/
gulp.task('build', buildTasks, function() {
    notifier.notify({ message: `Productoin completed` });
});