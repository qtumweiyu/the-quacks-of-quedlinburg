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

    statusPack(status) {
        return this.pack('status', status);
    }

    alterPack(payload) {
        return this.pack('alter', payload);
    }

    closePack(payload) {
        return this.pack('close', payload);
    }
}

module.exports = IoHelper;