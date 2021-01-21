'use strict';

module.exports = () => {
    return async function passport(ctx, next) {
        const auth = require('basic-auth');
        const authInfo = auth(ctx.request);
        if (authInfo && authInfo.name && authInfo.pass) {
            const { name, pass } = authInfo;
            const userId = name;
            const token = pass;
            const session = await ctx.app.model.session.get(token);
            if (session && session.id === userId) {
                const user = await ctx.app.model.user.get({ id: userId });
                if (user) {
                    user.session = session;
                    user.token = token;
                    delete user.hashPassword;
                    ctx.user = user;
                    await ctx.app.model.session.refresh(token);
                }
            }
        }

        await next();
    };
};
