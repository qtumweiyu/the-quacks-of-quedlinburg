module.exports = () => {
    return {
        //METHOD api name: {
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
    };
};