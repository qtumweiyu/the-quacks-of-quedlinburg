'use strict';

module.exports = appInfo => {
    const exports = {};

    exports.logger = {
        dir: `/data/logs/${appInfo.name}/`,
    };

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