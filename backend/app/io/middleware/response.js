const _ = require('lodash');

module.exports = () => {
    return async function response(ctx, next) {
        try {
            await next();
        } catch (e) {
            ctx.logger.warn(`${ctx.socket.nsp.name} ${JSON.stringify(_.slice(ctx.packet, 0, -1))} --> ${JSON.stringify(e)}`);
            ctx.socket.nsp.emit(ctx.socket.id, ctx.app.ioHelper.alterPack(e));
        }
    };
};