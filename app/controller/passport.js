const Controller = require('egg').Controller;

class PassportController extends Controller {
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
