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
        // room
        ROOM_NOT_EXISTS: {
            code: 40001,
            message: 'Room not exists',
        },
        ROOM_CANNOT_CREATE_MORE_ROOMS: {
            code: 40002,
            message: 'Cannot create more rooms',
        },
        ROOM_CANNOT_JOIN_MORE_ROOMS: {
            code: 40003,
            message: 'Cannot join more rooms',
        },
        ROOM_IS_FULL: {
            code: 40004,
            message: 'Room is full',
        },
        ROOM_PLAYER_IS_PLAYING: {
            code: 40004,
            message: 'Room player is playing',
        },
        ROOM_PASSWORD_ERROR: {
            code: 40005,
            message: 'Room password error',
        },
        ROOM_CANNOT_MODIFY: {
            code: 40006,
            message: 'You cannot modify room',
        },
    };
};