const BaseController = require('./baseController');

class UserController extends BaseController {
    info() {
        this.ctx.body = this.ctx.user;
    }
}

module.exports = UserController;
