'use strict';

const webapp = 'webapp';
const src = `${webapp}/src`;
const dist = `${webapp}/dist`;
const staticName = 'static';
const viewName = 'views';
const coreName = 'core';

const path = {
    static: staticName,
    baseView: `generic/base`,
    src: {
        root: src,
        static: `${webapp}/${staticName}`,
        style: `${src}/styles`,
        script: `${src}/scripts`,
        view: `${src}/${viewName}`
    },

    dist: {
        root: dist,
        static: `${dist}/${staticName}`,
        style: `${dist}/${staticName}/styles`,
        script: `${dist}/${staticName}/scripts`,
        view: `${dist}/${viewName}`
    }
};

module.exports = {
    path: path,

    /**
     * integrate styles and scritps for common using.
     */
    core: {
        name: coreName,
        style: `${path.src.style}/${coreName}.styl`,
        script: [
            `${path.src.static}/vendors/jquery.min.js`,
            `${path.src.static}/vendors/velocity.all.min.js`,
            `${path.src.script}/utils/http.js`,
            `${path.src.script}/widgets/alert.js`,
            `${path.src.script}/widgets/confirm.js`,
            `${path.src.script}/widgets/modal.js`
        ]
    },

    /**
     * each page is a task
     * the task name is the page name, each page may has scirpt and style
     */
    tasks: {
        'index': {
            style: `${path.src.style}/index.styl`,
            script: []
        },
        'login': {
            style: `${path.src.style}/login.styl`,
            script: [
                `${path.src.script}/login.js`
            ]
        },
        'register': {
            style: `${path.src.style}/register.styl`,
            script: [
                `${path.src.script}/register.js`
            ]
        },
        '404': {
            style: `${path.src.style}/404.styl`,
            script: []
        },
        '500': {
            style: `${path.src.style}/500.styl`,
            script: []
        }
    }
};