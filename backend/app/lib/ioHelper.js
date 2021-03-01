class IoHelper {
    constructor(app) {
        this.app = app;
    }

    broadcast(nsp, room, pack) {
        nsp.to(room).emit('broadcast', pack);
    }

    close(socket, message = null, afterSec = 1) {
        const nsp = this.getNsp(socket);
        if (message) {
            nsp.emit(socket.id, this.closePack(message));
        }
        if (afterSec > 0) {
            setTimeout(() => {
                nsp.adapter.remoteDisconnect(socket.id, true);
            }, afterSec * 1000);
        } else {
            nsp.adapter.remoteDisconnect(socket.id, true);
        }
    }

    send(socket, data) {
        const nsp = this.getNsp(socket);
        nsp.emit(socket.id, data);
    }

    getNsp(socket) {
        return this.app.io.of(socket.nsp.name);
    }

    pack(type, payload) {
        return {
            type,
            payload,
            meta: {
                timestamp: Date.now() / 1000 | 0,
            },
        };
    }

    passportPack(user) {
        return this.pack('passport', user);
    }

    statePack(state) {
        return this.pack('state', state);
    }

    alertPack(payload) {
        return this.pack('alert', payload);
    }

    closePack(payload) {
        return this.pack('close', payload);
    }
}

module.exports = IoHelper;