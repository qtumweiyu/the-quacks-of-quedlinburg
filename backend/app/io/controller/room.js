const BaseController = require('./baseController');

class RoomController extends BaseController {
    async login() {
        const { id, name } = this.ctx.params;
        const user = await this.app.model.passport.login(id, name);
        if (user) {
            this.ctx.socket.sid = user.id;
            if (user.roomId) {
                await this.ctx.socket.join(user.roomId);
            }
        }
        return this.app.ioHelper.send(this.ctx.socket, this.app.ioHelper.passportPack(user));
    }

    async create() {
        this.checkLogin();
        if (this.ctx.user.roomId) {
            throw this.app.config.errorCode.ROOM_CANNOT_CREATE_MORE_ROOMS;
        }
        const { size } = this.ctx.params;
        if (isNaN(size) || size < 2 || size > 5) {
            throw this.app.config.errorCode.PARAMS_INVALID;
        }
        const room = await this.app.model.room.create(size, this.ctx.user);
        await this.ctx.socket.join(room.id);
        return this.app.ioHelper.send(this.ctx.socket, this.app.ioHelper.statePack(room));
    }

    async join() {
        this.checkLogin();
        if (this.ctx.user.roomId) {
            throw this.app.config.errorCode.ROOM_CANNOT_JOIN_MORE_ROOMS;
        }
        const { password } = this.ctx.params;
        const room = await this.app.model.room.join(password, this.ctx.user);
        this.ctx.socket.join(room.id);
        return this.app.ioHelper.send(this.ctx.socket, this.app.ioHelper.statePack(room));
    }

    async leave() {
        this.checkInRoom();
        const room = await this.app.model.room.leave(this.ctx.user);
        await this.ctx.socket.leave(room.id);
    }

    async ready() {
        this.checkInRoom();
        await this.app.model.room.ready(this.ctx.user);
    }
}

module.exports = RoomController;
