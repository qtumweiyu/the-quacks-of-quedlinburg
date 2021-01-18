'use strict';

module.exports = () => {
    return async function passport(ctx, next) {
        await next();

        return;

        const auth = require('basic-auth');
        const authInfo = auth(ctx.request);
        if (authInfo && authInfo.name && authInfo.pass) {
            const { name, pass } = authInfo;
            const session = await ctx.app.model.session.get(pass);
            if (session && session.id === name) {
                if (ctx.request.isAdminReq) {
                    const admin = await ctx.app.model.adminUser.fetchById(session.id);
                    if (admin && admin.isActive) {
                        admin.session = session;
                        admin.token = pass;
                        ctx.admin = admin;
                        await ctx.app.model.session.refresh(pass);
                    }
                } else {
                    const user = await ctx.app.dao.user.get({ id: session.id });
                    if (user) {
                        user.session = session;
                        user.token = pass;
                        ctx.user = user;
                        await ctx.app.model.session.refresh(pass);
                    }
                }
            }
        }

        await next();
    };
};
