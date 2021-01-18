module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    // passport
    router.post('/passport/register', controller.passport.register);
    router.post('/passport/login', controller.passport.login);
};
