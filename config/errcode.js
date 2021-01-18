'use strict';

module.exports = () => {
    return {
        // common
        PARAMS_REQUIRED: {
            code: 10002,
            message: 'Missing Required Params',
        },
        PARAMS_INVALID: {
            code: 10003,
            message: 'Params Invalid',
        },
    };
};