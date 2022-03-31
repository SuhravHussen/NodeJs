/* eslint-disable no-underscore-dangle */
// dependencies
const data = require('../../lib/data');
const { hash, randomString, parseJson } = require('../../helpers/utilities');

// module scaffolding
const handler = {};
handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};
handler._token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashedPassword = hash(password);
            if (hashedPassword === parseJson(userData).password) {
                const tokenId = randomString(20);
                const expire = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expire,
                };
                // store the token
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            message: 'server side problem',
                        });
                    }
                });
            } else {
                callback(400, {
                    message: 'Password didnt match',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Incorrect phone or password',
        });
    }
};
handler._token.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.query.id === 'string' &&
        requestProperties.query.id.trim().length === 20
            ? requestProperties.query.id
            : false;
    if (id) {
        // search user
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJson(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, { message: 'token not found' });
            }
        });
    } else {
        callback(404, { message: 'invalid token' });
    }
};
handler._token.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;
    const extend =
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
            ? requestProperties.body.extend
            : false;
    if (id && extend) {
        data.read('tokens', id, (err1, tokenData) => {
            const tokenObject = parseJson(tokenData);
            if (tokenObject.expire > Date.now()) {
                tokenObject.expire = Date.now() + 60 * 60 * 1000;
                data.update('tokens', id, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'updated successfully',
                        });
                    } else {
                        callback(500, {
                            message: 'There was server side error',
                        });
                    }
                });
            } else {
                callback(400, {
                    message: 'Token alrady expired',
                });
            }
        });
    } else {
        callback(400, {
            message: 'There was a problem in your request',
        });
    }
};
handler._token.delete = (requestProperties, callback) => {
    const token =
        typeof requestProperties.query.id === 'string' &&
        requestProperties.query.id.trim().length === 20
            ? requestProperties.query.id
            : false;
    if (token) {
        data.read('tokens', token, (error1, tokenData) => {
            console.log(token);
            if (!error1 && tokenData) {
                data.delete('tokens', token, (error2) => {
                    if (!error2) {
                        callback(200, {
                            message: 'delete successful',
                        });
                    } else {
                        callback(500, {
                            message: 'problem in deleting token',
                        });
                    }
                });
            } else {
                callback(500, {
                    message: 'couldnt find token',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Invalid token id',
        });
    }
};
handler._token.verify = (verifiyTokenId, phone, callback) => {
    const token = typeof verifiyTokenId === 'string' ? verifiyTokenId : false;
    data.read('tokens', token, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJson(tokenData).phone === phone && parseJson(tokenData).expire > Date.now()) {
                console.log('hello', tokenData);
                callback(true);
            } else {
                callback(false);
            }
        } else {
            console.log(err);
            callback(false);
        }
    });
};
module.exports = handler;
