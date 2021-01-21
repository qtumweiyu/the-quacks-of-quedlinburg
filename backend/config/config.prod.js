'use strict';

module.exports = appInfo => {
    const exports = {};

    exports.logger = {
        dir: `/data/logs/${appInfo.name}/`,
    };

    exports.mysql = {
        // 单数据库信息配置
        client: require('./mysql.prod'),
    };

    exports.redis = {
        client: {
            port: 6379,
            host: '127.0.0.1',
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


    return exports;
};