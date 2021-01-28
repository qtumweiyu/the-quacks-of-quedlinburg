const baseModel = require('./baseMysqlModel');
const uuid = require('uuid/v4');

class Room extends baseModel {
    init() {
        this.statusMap = {
            FREE: 0,
            PLAYING: 1,
        };
        //socket io
        this.nsp = this.app.io.of('/room');
    }

    setTableName() {
        this.tableName = 'room';
    }

    async create(name, password, size, user) {
        const res = await this.findOrCreate({
            createdBy: user.id,
        }, {
            id: uuid(),
            name,
            password,
            size,
            owner: user.id,
            status: this.statusMap.FREE,
            createdAt: Date.now() / 1000 | 0,
        });
        if (res.isNew) {
            const room = res.data;
            await this.join(room, user);
            return room;
        } else {
            throw this.app.config.errorCode.ROOM_CANNOT_CREATE_MORE_ROOMS;
        }
    }

    async join(room, password, player) {
        if (password !== room.password) {
            throw this.app.config.errorCode.ROOM_PASSWORD_ERROR;
        }
        await this.app.model.roomPlayer.join(room, player);
        await this.broadcast(room);
        return true;
    }

    async leave(room, player, force = false) {
        await this.app.model.roomPlayer.leave(room, player, force);
        await this.broadcast(room);
        const playerList = await this.getPlayerList(room);
        if (playerList.length > 0) {
            await this.setOwner(room, playerList[0]);
        } else {
            await this.destroy(room);
        }
        return true;
    }

    async getPlayerList(room) {
        return this.app.model.roomPlayer.getPlayerList(room);
    }

    async setOwner(room, player) {
        await this.update({
            id: room.id,
            owner: player.id,
        });
        await this.broadcast(room);
    }

    async destroy(room) {
        const playerList = await this.getPlayerList(room);
        await Promise.all(playerList.map(async player => {
            return this.app.model.roomPlayer.leave(room, player, true);
        }));
        await this.delete({
            id: room.id,
        });
        // todo clear broadcast queue & state
    }

    async list() {
        return this.select({
            orders: [['createdAt', 'desc']],
        });
    }

    async isIn(room, user) {
        const playerList = await this.getPlayerList(room);
        let isIn = false;
        playerList.forEach(player => {
            isIn = isIn || (player.id === user.id);
        });
        return isIn;
    }

    async fetchState(room) {
        return RoomState.load(room);
    }

    async broadcast(room) {
        this.app.ioHelper.broadcast(this.nsp, room.id, await this.fetchState(room));
    }
}

const ROOM_STATE_CACHE_PREFIX = 'model::room::roomState::';

class RoomState {
    static async load(room, app) {
        return new RoomState(app, room, JSON.parse(await app.cache.get(`${ROOM_STATE_CACHE_PREFIX}${room.id}`)));
    }

    constructor(app, room, data) {
        this.app = app;
        this.room = room;
        this.data = {};
        this.parse(data);
    }

    parse(data) {
        if (data === null) {
            return;
        }
    }

    async save() {
        const data = this.toJson();
        await this.app.cache.set(`${ROOM_STATE_CACHE_PREFIX}${this.room.id}`, JSON.stringify(data));
        return data;
    }

    toJson() {
        return {
            id: this.room.id,
        };
    }
}

module.exports = Room;