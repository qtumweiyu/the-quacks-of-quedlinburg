const baseModel = require('./baseModel');

class Passport extends baseModel {
    loginRequired() {
        throw this.app.config.errorCode.PASSPORT_LOGIN_REQUIRED;
    }

    hashPassword(password, key) {
        const md5 = require('md5');
        if (key === undefined) {
            const crypto = require('crypto');
            key = crypto.randomBytes(8).toString('hex');
        }
        const hashPassword = md5(`${key}${md5(password)}`);
        return `${key}${hashPassword}`;
    }

    validatePassword(hashPassword, password) {
        const key = hashPassword.substr(0, 16);
        return hashPassword === this.hashPassword(password, key);
    }

    async login(name, password) {
        const user = await this.app.model.user.findByName(name);
        if (!user) {
            throw this.config.errorCode.PASSPORT_NAME_NOT_EXISTS;
        }
        if (!this.validatePassword(user.hashPassword, password)) {
            throw this.config.errorCode.PASSPORT_PASSWORD_ERROR;
        }
        const { token } = await this.app.model.session.generateToken(user);
        user.token = token;
        delete user.hashPassword;
        return user;
    }

    async register(name, password) {
        await this.app.model.user.create(name, this.hashPassword(password));
        return await this.login(name, password);
    }
}

module.exports = Passport;