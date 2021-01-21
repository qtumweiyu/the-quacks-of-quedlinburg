module.exports = () => {
    return async function response(ctx, next) {

        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Authorization');

        try {
            await next();
            if (ctx.response.status === 302) {
                return;
            }
            const body = ctx.body || {};
            if (ctx.response.status === 200) {
                if (body.list && body.pagination) {
                    ctx.body = {
                        success: true,
                        data: body.list,
                        pagination: body.pagination,
                    };
                } else {
                    ctx.body = {
                        success: true,
                        data: body,
                    };
                }
            } else {
                ctx.body = {
                    success: false,
                    err: {
                        code: ctx.response.status,
                        msg: ctx.response.message,
                        data: body,
                    },
                };
            }
            ctx.response.status = 200;
            ctx.response.message = 'OK';
        } catch (e) {
            ctx.logger.warn(`${ctx.request.path} --> ${JSON.stringify(e)}`, e);
            ctx.body = {
                success: false,
                err: {
                    code: e.code || e.status || 500,
                    msg: e.message || 'FAILED',
                    data: e.data || ((typeof e === 'string') && e),
                },
            };
            ctx.response.status = 200;
            ctx.response.message = 'OK';
        }
    };
};