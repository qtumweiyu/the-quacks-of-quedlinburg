'use strict';

const paramsMap = require('./params');
const errcode = require('./errcode');

module.exports = appInfo => {
    const config = {};
    appInfo.appName = config.appName;

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + 'axbsasadxzasdiqvljs';

    config.cachePrefix = config.appName;

    // add your config here
    config.middleware = [
        'response',
        'passport',
        'params',
    ];

    config.security = {
        csrf: { enable: false },
    };

    config.paramsMap = paramsMap();
    config.errorCode = errcode();

    exports.mysql = {
        // 单数据库信息配置
        client: {
            // host
            host: 'localhost',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: '',
            // 数据库名
            database: 'quacks',
        },
    };

    exports.redis = {
        client: {
            host: '127.0.0.1',
            port: 6379,
            password: '',
            db: 0,
        },
    };

    exports.io = {
        redis: {
            host: '127.0.0.1',
            port: 6379,
            password: '',
            db: 1,
        },
    };

    return config;
};