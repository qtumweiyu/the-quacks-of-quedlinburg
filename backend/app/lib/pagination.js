'use strict';

class Pagination {
    constructor(app) {
        this.app = app;
    }

    format(total, page, perPage) {
        return {
            total,
            page,
            perPage,
            pages: Math.ceil(total / perPage),
        };
    }

    formatParam(page, perPage) {
        return {
            page: Math.max(1, page),
            perPage: Math.min(100, Math.max(1, perPage)),
        };
    }
}

module.exports = Pagination;
