const BaseController = require('./baseController');

class RoomController extends BaseController {
    async list() {
        this.ctx.body = (await this.app.model.room.list()).map(room => {
            delete room.password;
            return room;
        });
    }

    async create() {
        const { name, password, size } = this.ctx.request.params;
        this.ctx.body = await this.app.model.room.create(name, password, size, this.ctx.user);
    }

    async join() {
        const { roomId, password } = this.ctx.request.params;
        const room = await this.fetchRoom(roomId);
        this.ctx.body = await this.app.model.room.join(room, password, this.ctx.user);
    }

    async leave() {
        const { roomId, force } = this.ctx.request.params;
        const room = await this.fetchRoom(roomId);
        this.ctx.body = await this.app.model.room.leave(room, this.ctx.user, force);
    }

    async destroy() {
        const { roomId } = this.ctx.request.params;
        const room = await this.fetchCanModifyRoom(roomId, this.ctx.user.id);
        this.ctx.body = await this.app.model.room.destroy(room);
    }
}

module.exports = RoomController;
