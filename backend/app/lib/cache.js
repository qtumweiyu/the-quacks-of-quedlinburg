'use strict';

const _ = require('lodash');

class Cache {
    constructor(app) {
        this.app = app;
        this.redis = app.redis;
        this.prefix = app.config.cachePrefix;
    }

    async set(key, ...args) {
        return await this.redis.set(`${this.prefix}::${key}`, ...args);
    }

    async setex(key, ...args) {
        return this.redis.setex(`${this.prefix}::${key}`, ...args);
    }

    async get(key, ...args) {
        return this.redis.get(`${this.prefix}::${key}`, ...args);
    }

    async hset(key, ...args) {
        return this.redis.hset(`${this.prefix}::${key}`, ...args);
    }

    async hsetnx(key, ...args) {
        return this.redis.hsetnx(`${this.prefix}::${key}`, ...args);
    }

    async hget(key, ...args) {
        return this.redis.hget(`${this.prefix}::${key}`, ...args);
    }

    async hkeys(key, ...args) {
        return this.redis.hkeys(`${this.prefix}::${key}`, ...args);
    }

    async hgetall(key, ...args) {
        return this.redis.hgetall(`${this.prefix}::${key}`, ...args);
    }

    async hincrby(key, ...args) {
        return this.redis.hincrby(`${this.prefix}::${key}`, ...args);
    }

    async hdel(key, ...args) {
        return this.redis.hdel(`${this.prefix}::${key}`, ...args);
    }

    async del(key, ...args) {
        return this.redis.del(`${this.prefix}::${key}`, ...args);
    }

    async ttl(key, ...args) {
        return this.redis.ttl(`${this.prefix}::${key}`, ...args);
    }

    async expire(key, ...args) {
        return await this.redis.expire(`${this.prefix}::${key}`, ...args);
    }

    async fetchWithCache(key, ttl, dataBuilder) {
        const res = await this.get(key);
        if (res) {
            return JSON.parse(res);
        } else {
            try {
                const data = await dataBuilder();
                await this.setex(key, ttl, JSON.stringify(data));
                return data;
            } catch (e) {
                this.app.logger.warn('fetch with cache error!!!', e);
                throw e;
            }
        }
    }
}

module.exports = Cache;