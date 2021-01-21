const BaseModel = require('./baseModel');

class BaseMysqlModel extends BaseModel {
    constructor(...props) {
        super(...props);
        this.tableName = '';
        this.setTableName();
    }

    setTableName() {
        this.tableName = '';
    }

    async fetchById(id) {
        return this.get({
            id,
        });
    }

    async fetchAll(desc = true) {
        return this.select({
            orders: [['createdAt', desc ? 'desc' : 'asc']],
        });
    }

    async insert(...args) {
        return this.app.mysql.insert(this.tableName, ...args);
    }

    async get(...args) {
        return this.app.mysql.get(this.tableName, ...args);
    }

    async select(...args) {
        return this.app.mysql.select(this.tableName, ...args);
    }

    async update(...args) {
        return this.app.mysql.update(this.tableName, ...args);
    }

    async delete(...args) {
        return this.app.mysql.delete(this.tableName, ...args);
    }

    async query(...args) {
        return await this.app.mysql.query(...args);
    }

    async count(...args) {
        return Number(this.app.mysql.count(this.tableName, ...args));
    }

    async findOrCreate(where = {}, defaultData = {}) {
        let data = await this.get(where);
        if (data) {
            return {
                data,
                isNew: false,
            };
        } else {
            data = {
                ...where,
                ...defaultData,
            };
            await this.insert(data);
            return {
                data,
                isNew: true,
            };
        }
    }

    async createOrUpdate(where = {}, updateData = {}, defaultData = {}) {
        let data = await this.get(where);
        if (data) {
            await this.update(updateData, {
                where,
            });
            return {
                data,
                isNew: false,
            };
        } else {
            data = {
                ...where,
                ...updateData,
                ...defaultData,
            };
            await this.insert(data);
            return {
                data,
                isNew: true,
            };
        }
    }

    async safeUpdate(id, data = {}, allowFields = [], uniqueFields = {}) {
        const updateData = {
            id,
        };
        await Promise.all(Object.keys(data).map(async key => {
            if (allowFields.includes(key)) {
                if (data.hasOwnProperty(key)) {
                    if (uniqueFields[key]) {
                        const where = {};
                        where[key] = data[key];
                        const has = await this.get(where);
                        if (has && (has.id !== id)) {
                            throw uniqueFields[key];
                        }
                    }
                    updateData[key] = data[key];
                }
            }
        }));
        await this.update(updateData);
    }
}

module.exports = BaseMysqlModel;
