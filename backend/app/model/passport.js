const BaseModel = require('./baseModel');

class Passport extends BaseModel {
    async login(id, name) {
        if (id) {
            const user = await this.app.model.session.get(id);
            if (user) {
                await this.app.model.session.refresh(id);
                if (user.roomId) {
                    user.room = await this.app.model.room.load(user.roomId);
                }
                return user;
            }
        }
        if (name) {
            return await this.app.model.session.create({
                name,
                room: null,
            });
        }
        return null;
    }
}

module.exports = Passport;
