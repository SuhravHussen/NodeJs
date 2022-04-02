/* eslint-disable no-underscore-dangle */
// dependencies
const data = require('../../lib/data');
const { parseJson, randomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const environment = require('../../helpers/env');
// module scaffolding
const handler = {};
handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler.check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler.check = {};
handler.check.post = (requestProperties, callback) => {
    // validate inputs
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;
    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;

    const successCode =
        requestProperties.body.successCode instanceof Array
            ? requestProperties.body.successCode
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;
    if (protocol && url && method && successCode && timeoutSeconds) {
        const token =
            typeof requestProperties.headers.token === 'string'
                ? requestProperties.headers.token
                : false;

        // lookup the user phone by reading the tooken
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const userPhone = parseJson(tokenData).phone;

                // lookup the user data
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler._token.verify(token, userPhone, (verifiedTOken) => {
                            if (verifiedTOken) {
                                const userObject = parseJson(userData);
                                const userChecks =
                                    userObject.checks && userObject.checks instanceof Array
                                        ? userObject.checks
                                        : [];
                                if (userChecks.length <= environment.maxChecks) {
                                    const checkId = randomString(20);
                                    const checkObj = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCode,
                                        timeoutSeconds,
                                    };

                                    data.create('checks', checkId, checkObj, (err3) => {
                                        if (!err3) {
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);
                                        } else {
                                            callback(500, {
                                                error: 'server side problem',
                                            });
                                        }
                                        data.update('users', userPhone, userObject, (err4) => {
                                            if (!err4) {
                                                callback(200, checkObj);
                                            } else {
                                                callback(500, {
                                                    error: 'server side problem',
                                                });
                                            }
                                        });
                                    });
                                } else {
                                    callback(403, {
                                        error: 'token verification failed',
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: 'token verification failed',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'user not found',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'auth problem ',
                });
            }
        });
    } else {
        callback(400, {
            error: 'you have a problem in your request ',
        });
    }
};
handler.check.get = (requestProperties, callback) => {};
handler.check.put = (requestProperties, callback) => {};
handler.check.delete = (requestProperties, callback) => {};

module.exports = handler;
