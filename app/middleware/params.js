'use strict';

const _ = require('lodash');
const REQUIRED = 0;
const TYPE = 1;
const DEFAULT = 2;

module.exports = () => {
    const typeChecker = (value, type) => {
        let res = false;
        let msg = '';
        const options = type.split('|');
        type = options.shift();
        switch (type) {
            case 'regex':
                res = new RegExp(options[0]).test(value);
                break;
            case 'string' :
                if (options.length === 0) {
                    options.push(1);
                    options.push(200);
                }
                const [min, max] = options;
                if (max) {
                    if (value.length < min) {
                        res = false;
                        msg = `length should great than ${min}`;
                    } else if (value.length > max) {
                        res = false;
                        msg = `length should less than ${max}`;
                    } else {
                        res = true;
                    }
                } else {
                    if (value.length !== Number(min)) {
                        res = false;
                        msg = `length should be ${min}`;
                    } else {
                        res = true;
                    }
                }
                break;
            case 'int' :
                res = _.isSafeInteger(Number(value)) && value >= 0;
                break;
            case 'float' :
                res = _.isNumber(Number(value));
                break;
            case 'bool' :
                res = /^(0|1)$/.test(value) || _.isBoolean(value);
                break;
            case 'object' :
                res = _.isObjectLike(value);
                break;
            default :
                // todo
                throw `type '${type}' is not defined`;
        }
        return [res, msg];
    };
    const typeFormatter = (value, type) => {
        let res;
        const options = type.split('|');
        type = options.shift();
        switch (type) {
            case 'regex' :
            case 'string' :
            case 'shareStatus' :
                res = value;
                break;
            case 'int' :
                res = parseInt(value);
                break;
            case 'float' :
                res = parseFloat(value);
                break;
            case 'bool' :
                res = _.isBoolean(value) ? value : !!parseInt(value);
                break;
            case 'object' :
                res = JSON.parse(value);
                break;
            default :
                res = undefined;
        }
        return res;
    };
    return async function params(ctx, next) {
        const paramsMap = ctx.app.config.paramsMap;
        const method = ctx.request.method.toUpperCase();
        const router = ctx.router.match(ctx.request.path).path[0];
        if (!router || !router.methods.includes(method)) {
            ctx.throw(501);
        }
        const paramsConfig = paramsMap[`${method} ${router.path}`];
        if (!paramsConfig) {
            ctx.throw(501);
        }
        const params = {};
        if (router.paramNames) {
            const paramParseRes = new RegExp(router.regexp).exec(ctx.request.path);
            router.paramNames.forEach((item, index) => {
                params[item.name] = paramParseRes[index + 1];
            });
        }
        Object.keys(paramsConfig).forEach(key => {
            let value = null;
            if (router.path.indexOf(`:${key}`) >= 0) {
                value = params[key];
            } else {
                if (method === 'POST') {
                    value = ctx.request.body[key];
                } else if (method === 'GET') {
                    value = ctx.request.query[key];
                }
            }
            if (paramsConfig[key][REQUIRED]) {
                // required
                if (value === undefined || value === null) {
                    const error = ctx.app.config.errorCode.PARAMS_REQUIRED;
                    error.message = `${key} is required`;
                    throw error;
                }
            } else {
                if (!value) {
                    value = paramsConfig[key][DEFAULT];
                }
            }
            const [checkRes, msg] = typeChecker(value, paramsConfig[key][TYPE]);
            if (!checkRes) {
                const error = ctx.app.config.errorCode.PARAMS_INVALID;
                if (!msg) {
                    error.message = `${key} is not a valid ${paramsConfig[key][TYPE]}`;
                } else {
                    error.message = `${key} ${msg}`;
                }
                throw error;
            }
            value = typeFormatter(value, paramsConfig[key][TYPE]);
            ctx.request.params[key] = value;
        });
        await next();
    };
};