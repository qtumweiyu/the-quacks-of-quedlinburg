const BaseModel = require('./baseModel');

const uuid = require('uuid/v4');
const DEFAULT_TTL = 86400 * 2;

class Session extends BaseModel {
    generateKey(id) {
        return `model::session::${id}`;
    }

    async create(user, ttl = DEFAULT_TTL) {
        const id = uuid();
        user.id = id;
        await this.app.cache.set(this.generateKey(id), JSON.stringify(user), 'EX', ttl);
        return user;
    }

    async get(id) {
        const rawData = await this.app.cache.get(this.generateKey(id));
        try {
            return JSON.parse(rawData);
        } catch {
            return null;
        }
    }

    async setValue(id, k, v) {
        const key = this.generateKey(id);
        const [rawData, ttl] = await Promise.all([
            this.app.cache.get(key),
            this.app.cache.ttl(key),
        ]);
        try {
            const session = JSON.parse(rawData);
            if (v === null) {
                delete session[k];
            } else {
                session[k] = v;
            }
            await this.app.cache.setex(key, ttl, JSON.stringify(session));
            return true;
        } catch {
            return false;
        }
    }

    async refresh(id, ttl = DEFAULT_TTL) {
        return this.app.cache.expire(this.generateKey(id), ttl);
    }
}

module.exports = Session;
