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

    config.mysql = {
        // 单数据库信息配置
        client: require('./mysql.dev'),
    };

    config.redis = {
        client: {
            host: '127.0.0.1',
            port: 6379,
            password: '',
            db: 0,
        },
    };

    config.io = {
        redis: {
            host: '127.0.0.1',
            port: 6379,
            password: '',
            db: 1,
        },
    };

    return config;
};