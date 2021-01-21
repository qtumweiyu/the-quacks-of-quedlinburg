const BaseController = require('./baseController');

class RoomController extends BaseController {
    async enter() {
        const [roomId] = this.ctx.args;
    }
}

module.exports = RoomController;
