const BaseModel = require('./baseModel');
const uuid = require('uuid/v4');

class Room extends BaseModel {
    init() {
        this.passwordManager = new PasswordManager(this.app);
        this.stateManager = new StateManager(this.app);
    }

    async broadcast(id) {
        const nspName = '/room';
        const nsp = this.app.io.of(nspName);
        this.app.ioHelper.broadcast(nsp, id, this.app.ioHelper.statePack(await this.load(id)));
    }

    async load(id) {
        return this.stateManager.load(id);
    }

    async create(size, user) {
        const id = uuid();
        const room = await this.stateManager.create(id, size, user);
        await this.broadcast(id);
        return room;
    }

    async join(password, user) {
        const id = await this.passwordManager.find(password);
        if (!id) {
            throw this.app.config.errorCode.ROOM_NOT_EXISTS;
        }
        const room = await this.stateManager.join(id, user);
        await this.broadcast(id);
        return room;
    }

    async leave(user) {
        if (!user.roomId) {
            throw this.app.config.errorCode.ROOM_USER_NOT_IN;
        }
        const id = user.roomId;
        const room = await this.stateManager.leave(user);
        await this.broadcast(id);
        return room;
    }

    async ready(user) {
        if (!user.roomId) {
            throw this.app.config.errorCode.ROOM_USER_NOT_IN;
        }
        const id = user.roomId;
        await this.stateManager.ready(user);
        await this.broadcast(id);
    }

    async clean() {
        await this.stateManager.clean();
        await this.passwordManager.clean();
    }
}

const STATE_CACHE_KEY = 'model::room:state';

class StateManager {
    constructor(app) {
        this.app = app;
        this.userStatusMap = {
            FREE: 0,
            READY: 1,
        };
    }

    async create(id, size, user) {
        await this.save(id, {
            id,
            meta: {
                createdAt: Date.now() / 1000 | 0,
                createdBy: user.id,
                password: await this.app.model.room.passwordManager.create(id),
                size,
                player: {},
            },
            game: null,
        });
        return this.join(id, user);
    }

    async load(id) {
        return JSON.parse(await this.app.cache.hget(STATE_CACHE_KEY, id));
    }

    async save(id, data) {
        return this.app.cache.hset(STATE_CACHE_KEY, id, JSON.stringify(data));
    }

    async del(id) {
        return this.app.cache.hdel(STATE_CACHE_KEY, id);
    }

    async update(id, fn) {
        return this.app.locker.run(`${STATE_CACHE_KEY}::${id}`, async () => {
            let state = await this.load(id);
            if (!state) {
                throw this.app.config.errorCode.ROOM_NOT_EXISTS;
            }
            state = await fn(state);
            await this.save(id, state);
            return state;
        });
    }

    async join(id, user) {
        return this.update(id, async state => {
            if (Object.keys(state.meta.player).length >= state.meta.size) {
                throw this.app.config.errorCode.ROOM_IS_FULL;
            }
            state.meta.player[user.id] = {
                name: user.name,
                joinAt: Date.now() / 1000 | 0,
                status: this.userStatusMap.FREE,
            };
            await this.app.model.session.setValue(user.id, 'roomId', id);
            return state;
        });
    }

    async leave(user) {
        return this.update(user.roomId, async state => {
            if (state.game) {
                throw this.app.config.errorCode.ROOM_PLAYER_IS_PLAYING;
            }
            delete state.meta.player[user.id];
            await this.app.model.session.setValue(user.id, 'roomId', null);
            return state;
        });
    }

    async ready(user) {
        return this.update(user.roomId, async state => {
            state.meta.player[user.id].status = this.userStatusMap.READY;
            return state;
        });
    }

    async clean() {
        const map = await this.app.cache.hgetall(STATE_CACHE_KEY);
        await Promise.all(Object.keys(map).map(async id => {
            return this.app.locker.run(`${STATE_CACHE_KEY}::${id}`, async () => {
                const state = await this.load(id);
                if (Object.keys(state.meta.player).length) {
                    return;
                }
                await this.del(id);
            });
        }));
    }

    async start() {
        //return await this.app
    }
}

const PASSWORD_CACHE_KEY = 'model::room:passwordManager';
const MIN_PASSWORD_LEN = 6;

class PasswordManager {
    constructor(app) {
        this.app = app;
    }

    async create(id) {
        return this.app.locker.run(PASSWORD_CACHE_KEY, async () => {
            const len = await this.calLen();
            while (true) {
                const password = Math.random().toString().substr(2, len);
                if (await this.find(password)) {
                    continue;
                }
                await this.app.cache.hset(PASSWORD_CACHE_KEY, password, id);
                return password;
            }
        });
    }

    async find(password) {
        return this.app.cache.hget(PASSWORD_CACHE_KEY, password);
    }

    async del(password) {
        return this.app.cache.hdel(PASSWORD_CACHE_KEY, password);
    }

    async count() {
        return this.app.cache.hlen(PASSWORD_CACHE_KEY);
    }

    async calLen() {
        const count = await this.count();
        for (let i = MIN_PASSWORD_LEN; ; i++) {
            if (Math.pow(10, i - 1) > count) {
                return i;
            }
        }
    }

    async clean() {
        const map = await this.app.cache.hgetall(PASSWORD_CACHE_KEY);
        await Promise.all(Object.keys(map).map(async password => {
            const id = map[password];
            const room = await this.app.model.room.load(id);
            if (!room) {
                await this.del(password);
            }
        }));
    }
}

module.exports = Room;
