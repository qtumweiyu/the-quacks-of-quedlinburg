module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    // passport
    router.post('/passport/register', controller.passport.register);
    router.post('/passport/login', controller.passport.login);
    // user
    router.get('/user/info', controller.user.info);
    // room
    router.get('/room/list', controller.room.list);
    router.post('/room/create', controller.room.create);
    router.post('/room/join', controller.room.join);
    router.post('/room/leave', controller.room.leave);
};
