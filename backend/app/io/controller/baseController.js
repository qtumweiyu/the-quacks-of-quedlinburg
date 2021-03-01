const Controller = require('egg').Controller;

class BaseController extends Controller {
    checkLogin() {
        if (this.ctx.user === null) {
            throw this.app.config.errorCode.PASSPORT_LOGIN_REQUIRED;
        }
    }

    checkInRoom() {
        this.checkLogin();
        if (!this.ctx.user.roomId) {
            throw this.app.config.errorCode.ROOM_USER_NOT_IN;
        }
    }
}

module.exports = BaseController;