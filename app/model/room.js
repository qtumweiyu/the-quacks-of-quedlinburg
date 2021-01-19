const baseModel = require('./baseMysqlModel');
const uuid = require('uuid/v4');

class Room extends baseModel {
    init() {
        this.statusMap = {
            FREE: 0,
            PLAYING: 1,
        };
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
        // todo broadcast
        return true;
    }

    async leave(room, player, force = false) {
        await this.app.model.roomPlayer.leave(room, player, force);
        // todo broadcast
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
        //todo broadcast
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
}

module.exports = Room;