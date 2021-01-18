'use strict';

const fs = require('fs');
const path = require('path');

class Model {
    constructor(app) {
        this.app = app;
    }

    async loadModels() {
        const dir = __dirname;
        const models = {};
        const initList = [];
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            const reg = /^(.*).js$/;
            const res = reg.exec(file);
            const modelName = res && res[1];
            if (modelName === undefined || modelName.startsWith('base') || modelName === 'model') {
                return;
            }
            const Cls = require(filePath);
            models[modelName] = new Cls(this.app);
            initList.push(models[modelName].init());
        });
        await Promise.all(initList);
        return models;
    }
}


module.exports = Model;