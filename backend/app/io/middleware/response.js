const _ = require('lodash');

module.exports = () => {
    return async function response(ctx, next) {
        try {
            ctx.params = _.cloneDeep(ctx.packet[1]);
            if (ctx.socket.sid) {
                const res = await Promise.all([
                    ctx.app.model.session.get(ctx.socket.sid),
                    ctx.app.model.session.refresh(ctx.socket.sid),
                ]);
                ctx.user = res[0];
            }
            await next();
        } catch (e) {
            console.log(e);
            ctx.logger.warn(`${ctx.socket.nsp.name} ${JSON.stringify(_.slice(ctx.packet, 0, -1))} --> ${JSON.stringify(e)}`);
            ctx.socket.nsp.emit(ctx.socket.id, ctx.app.ioHelper.alertPack(e));
        }
    };
};