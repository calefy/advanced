var Express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    Path = require('path'),
    _ = require('lodash'),
    Utils = require('./utils');

/**
 * 创建Express app
 * @param fn {Function}
 * @returns {*|exports}
 */
function createApp(fn) {
    var app = Express();

    loadCustomConfig();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());

    // access log
    if (!Utils.isDev()) {
        app.use(require('./middlewares/accessLog'));
    }

    // 传入一个函数，自定义app的行为
    _.isFunction(fn) && fn(app);

    // 开发环境使用假数据
    if (Utils.isDev() && Utils.c('isMock')) {
        app.use(require('./middlewares/mock'));
    }

    // custom router
    app.use(loadRoutes());
    // simple router
    app.use(require('./middlewares/simpleRouter'));
    // api proxy
    app.use(require('./middlewares/apiProxy'));
    // 404
    app.use(require('./middlewares/404'));
    // 500
    app.use(require('./middlewares/500'));

    return app;
}

/**
 * 加载自定义配置
 * @returns {*|Array|Object}
 */
function loadCustomConfig() {
    var configPath = Utils.c('root') + '/config';
    if (Utils.fs.existsSync(configPath)) {
        Utils.fs.readdirSync(configPath).map(function(file) {
            // only require file whose filename starts with `config`
            if (!_.startsWith(file, 'config')) return;
            var config = require(Path.join(configPath, file));
            Utils.c(config);
        });
    }
}

/**
 * 加载路由配置
 * @returns {*}
 */
function loadRoutes() {
    var router;
    try {
        router = require(Utils.c('routesPath'));
    } catch (e) {
        // 如果文件不存在，则加载默认路由
        if (e.code === 'MODULE_NOT_FOUND') {
            router = require('./router')();
        } else {
            throw e;
        }
    }

    return router;
}

module.exports = createApp;
module.exports.Express = Express;
module.exports.Controller = require('./controller');
module.exports.Router = require('./router');
module.exports.Utils = Utils;
