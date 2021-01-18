'use strict';

module.exports = {
    params: {},
    get path() {
        const pos = this.url.indexOf('?');
        return (pos !== -1) ? this.url.substr(0, pos) : this.url;
    },
};