const Subscription = require('egg').Subscription;

class Clean extends Subscription {
    static get schedule() {
        return {
            interval: '600s',
            type: 'worker',
        };
    }

    async subscribe() {
        await this.app.model.room.clean();
    }
}

module.exports = Clean;
