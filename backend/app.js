const Pagination = require('./app/lib/pagination');
const Model = require('./app/model/model');
const Locker = require('./app/lib/locker');
const Cache = require('./app/lib/cache');
const IoHelper = require('./app/lib/ioHelper');

class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    async didReady() {
        this.app.pagination = new Pagination(this.app);
        this.app.cache = new Cache(this.app);
        this.app.locker = new Locker(this.app);
        this.app.ioHelper = new IoHelper(this.app);

        const model = new Model(this.app);
        this.app.model = await model.loadModels();
    }
}

module.exports = AppBootHook;