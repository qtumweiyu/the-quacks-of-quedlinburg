const BaseController = require('./baseController');

class RoomController extends BaseController {
    async enter() {
        const [roomId] = this.ctx.args;
        const room = await this.app.model.room.fetchById(roomId);
        if (!room) {
            this.app.ioHelper.close(this.ctx.socket, this.app.config.errorCode.ROOM_NOT_EXISTS);
            return;
        }
        const isInRoom = await this.app.model.room.isIn(room, this.ctx.user);
        if (!isInRoom) {
            this.app.ioHelper.close(this.ctx.socket, this.app.config.errorCode.ROOM_USER_NOT_IN);
            return;
        }
        this.ctx.socket.join(roomId);
    }
}

module.exports = RoomController;
