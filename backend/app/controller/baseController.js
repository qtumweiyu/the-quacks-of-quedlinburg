const Controller = require('egg').Controller;

class BaseController extends Controller {
    async fetchRoom(roomId) {
        const room = await this.app.model.room.fetchById(roomId);
        if (!room) {
            throw this.app.config.errorCode.ROOM_NOT_EXISTS;
        }
        return room;
    }

    async fetchCanModifyRoom(roomId, userId) {
        const room = await this.fetchRoom(roomId);
        if (room.owner !== userId) {
            throw this.app.config.errorCode.ROOM_CANNOT_MODIFY;
        }
        return room;
    }
}

module.exports = BaseController;