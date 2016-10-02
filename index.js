'use strict';
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();

const routers = require('./controllers');
const settings = require('./settings');
const conf = require('./webapp/build/conf');

// allow reverse proxy
app.enable('trust proxy');

/** static **/
const staticPath = __dirname + '/' + (settings.debug ? conf.path.src.static : conf.path.dist.static);
app.use('/static', express.static(staticPath, {maxAge: settings.staticMaxAge}));

/** template engine **/
const root = settings.debug ? conf.path.src.root : conf.path.dist.root;
nunjucks.configure(root + '/views', {
	autoescape: true,
	noCache: settings.debug,
	express: app
});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

/** routers **/
app.use(routers);

/**
 * error handling
 */
app.use((err, req, res, next) => {
	res.render('500', {err: 'Internal Error'});
});
app.use((req, res, next) => {
	res.render('404');
});

/** start app **/
app.listen(settings.port);
console.log(`visit ${settings.appName} -> http://localhost:${settings.port}`)