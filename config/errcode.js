'use strict';

module.exports = () => {
    return {
        // common
        PARAMS_REQUIRED: {
            code: 10001,
            message: 'Missing Required Params',
        },
        PARAMS_INVALID: {
            code: 10002,
            message: 'Params Invalid',
        },

        // passport
        PASSPORT_LOGIN_REQUIRED: {
            code: 20001,
            message: 'Login Required',
        },
        PASSPORT_PASSWORD_ERROR: {
            code: 20002,
            message: 'Password Invalid',
        },
        PASSPORT_NAME_NOT_EXISTS: {
            code: 20003,
            message: 'Name not exists',
        },
        // user
        USER_NAME_EXISTS: {
            code: 30001,
            message: 'Name exists',
        },
    };
};