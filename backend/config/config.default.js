'use strict';

const errcode = require('./errcode');

module.exports = appInfo => {
    const config = {
        appName: 'quacks',
    };
    appInfo.appName = config.appName;

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + 'axbsasadxzasdiqvljs';

    config.cachePrefix = config.appName;

    config.security = {
        csrf: { enable: false },
    };

    config.errorCode = errcode();

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
        namespace: {
            '/room': {
                connectionMiddleware: [],
                packetMiddleware: ['response'],
            },
        },
    };

    return config;
};