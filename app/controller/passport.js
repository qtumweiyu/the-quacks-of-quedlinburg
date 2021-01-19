const BaseController = require('./baseController');

class PassportController extends BaseController {
    async register() {
        const { name, password } = this.ctx.request.params;
        this.ctx.body = await this.app.model.passport.register(name, password);
    }

    async login() {
        const { name, password } = this.ctx.request.params;
        this.ctx.body = await this.app.model.passport.login(name, password);
    }
}

module.exports = PassportController;
