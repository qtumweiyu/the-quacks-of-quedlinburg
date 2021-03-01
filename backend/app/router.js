module.exports = app => {
    const { router, controller, io } = app;
    // socket.io
    io.of('/room').route('login', io.controller.room.login);
    io.of('/room').route('create', io.controller.room.create);
    io.of('/room').route('join', io.controller.room.join);
    io.of('/room').route('leave', io.controller.room.leave);
    io.of('/room').route('ready', io.controller.room.ready);
};
