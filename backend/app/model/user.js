const baseModel = require('./baseMysqlModel');
const uuid = require('uuid/v4');

class User extends baseModel {
    setTableName() {
        this.tableName = 'user';
    }

    async findByName(name) {
        return this.get({ name });
    }

    async create(name, hashPassword) {
        const res = await this.findOrCreate({
            name,
        }, {
            id: uuid(),
            hashPassword,
            createdAt: Date.now() / 1000 | 0,
        });
        if (res.isNew) {
            return res.data;
        } else {
            throw this.app.config.errorCode.USER_NAME_EXISTS;
        }
    }
}

module.exports = User;