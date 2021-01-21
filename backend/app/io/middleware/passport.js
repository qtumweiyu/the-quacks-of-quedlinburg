module.exports = () => {
    return async function passport(ctx, next) {
        const query = ctx.socket.handshake.query;
        const auth = Buffer.from(`${query.auth}`, 'base64');
        const [userId, token] = auth.toString('ascii').split(':');
        if (userId && token) {
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
