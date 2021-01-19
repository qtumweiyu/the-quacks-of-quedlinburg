const Controller = require('egg').Controller;

class BaseController extends Controller {
    async fetchRoom(roomId) {
        const room = await this.app.model.room.fetchById(roomId);
        if (!room) {
            throw this.app.config.errorCode.ROOM_NOT_EXISTS;
        }
        return room;
    }
}

module.exports = BaseController;