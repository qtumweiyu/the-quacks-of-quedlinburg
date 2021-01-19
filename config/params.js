module.exports = () => {
    return {
        //METHOD api name: {
        //      _level: 0|1... (default 0) (0: no need login 1: need login)
        //      param1 name : required, type, default
        //      param2 name : required, type, default
        //      ...
        // }
        // api
        // common
        'GET /': {},
        // passport
        'POST /passport/register': {
            name: [true, 'string|1|255'],
            password: [true, 'string'],
        },
        'POST /passport/login': {
            name: [true, 'string|1|255'],
            password: [true, 'string'],
        },
        // user
        'GET /user/info': {
            _level: 1,
        },
        // room
        'GET /room/list': {},
        'POST /room/create': {
            _level: 1,
            name: [true, 'string|1|255'],
            password: [true, 'string'],
            size: [true, 'int|2|5'],
        },
        'POST /room/join': {
            _level: 1,
            roomId: [true, 'string|36'],
            password: [true, 'string'],
        },
        'POST /room/leave': {
            _level: 1,
            roomId: [true, 'string|36'],
            force: [true, 'bool'],
        },
    };
};