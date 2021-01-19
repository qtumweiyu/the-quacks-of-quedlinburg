const baseModel = require('./baseMysqlModel');

class RoomPlayer extends baseModel {
    init() {
        this.statusMap = {
            FREE: 0,
            READY: 1,
            PLAYING: 2,
        };
    }

    setTableName() {
        this.tableName = 'room_player';
    }

    async join(room, player) {
        const userCount = await this.count({
            roomId: room.id,
        });
        if (userCount >= room.size) {
            throw this.app.config.errorCode.ROOM_IS_FULL;
        }
        const res = await this.findOrCreate({
            playerId: player.id,
        }, {
            roomId: room.id,
            status: this.statusMap.FREE,
            joinAt: Date.now() / 1000 | 0,
        });
        if (res.isNew) {
            return res.data;
        } else {
            throw this.app.config.errorCode.ROOM_CANNOT_JOIN_MORE_ROOMS;
        }
    }

    async leave(room, player, force = false) {
        const data = await this.get({
            roomId: room.id,
            playerId: player.id,
        });
        if (!data) {
            return true;
        }
        if (data.status === this.statusMap.PLAYING) {
            if (force) {
                // todo handle escape
            } else {
                throw this.app.config.errorCode.ROOM_PLAYER_IS_PLAYING;
            }
        }
        await this.delete({
            roomId: room.id,
            playerId: player.id,
        });
        return true;
    }

    async getPlayerList(room) {
        const list = await this.select({
            where: {
                roomId: room.id,
            },
            orders: [['joinAt', 'asc']],
        });
        return Promise.all(list.map(async data => {
            const user = await this.app.model.user.get({ id: data.playerId });
            user.status = data.status;
            user.joinAt = data.joinAt;
            delete user.hashPassword;
            return user;
        }));
    }
}

module.exports = RoomPlayer;