'use strict';

const DEFAULT_LOCK_TIMEOUT = 3600;

class Locker {
    constructor(app) {
        this.app = app;
    }

    async tryToRun(name, fn, timeout = DEFAULT_LOCK_TIMEOUT) {
        const key = `lib::locker::${name}`;
        const locker = await this.app.cache.set(key, Date.now(), 'EX', timeout, 'NX');
        if (locker === null) {
            return {
                locked: true,
            };
        }
        try {
            const data = await fn();
            await this.app.cache.del(key);
            return {
                data,
                locked: false,
            };
        } catch (e) {
            this.app.logger.warn('LOCKER call fn error!!!', e);
            await this.app.cache.del(key);
            throw e;
        }
    }

    async run(name, fn, timeout = DEFAULT_LOCK_TIMEOUT) {
        const sleep = time => new Promise(resolve => setTimeout(resolve, time));
        while (true) {
            const callRes = await this.tryToRun(name, fn, timeout);
            if (callRes && callRes.locked) {
                await sleep(Math.random() * 1000);
            } else {
                return callRes.data;
            }
        }
    }
}

module.exports = Locker;