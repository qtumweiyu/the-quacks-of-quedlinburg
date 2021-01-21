const BaseModel = require('./baseModel');

const uuid = require('uuid/v4');
const DEFAULT_TTL = 86400 * 2;

class Session extends BaseModel {
    generateKey(token) {
        return `model::session::${token}`;
    }

    async generateToken(user, ttl = DEFAULT_TTL) {
        const token = uuid();
        const session = {
            id: user.id,
        };
        await this.app.cache.set(this.generateKey(token), JSON.stringify(session), 'EX', ttl);
        return {
            token,
            ttl,
        };
    }

    async get(token) {
        const rawData = await this.app.cache.get(this.generateKey(token));
        try {
            return JSON.parse(rawData);
        } catch {
            return null;
        }
    }

    async setValue(token, k, v) {
        const key = this.generateKey(token);
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
            if (this.ctx.user && this.ctx.user.token === token) {
                this.ctx.user.session = session;
            }
            return true;
        } catch {
            return false;
        }
    }

    async refresh(token, ttl = DEFAULT_TTL) {
        return this.app.cache.expire(this.generateKey(token), ttl);
    }
}

module.exports = Session;
