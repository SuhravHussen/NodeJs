/* eslint-disable no-underscore-dangle */
// dependencies
const data = require('../../lib/data');
const { hash, parseJson } = require('../../helpers/utilities');

// module scaffolding
const handler = {};
handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};
handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

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

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'string' &&
        requestProperties.body.tosAgreement.trim().length > 0
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure the user doesn't already exist
        data.read('users', phone, (error) => {
            if (error) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, { message: 'user created successfully' });
                    } else {
                        callback(500, {
                            error: 'Could not create user',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'User may already exist',
                });
            }
        });
    } else {
        callback(400, {
            error: 'you have a problem in your request ',
        });
    }
};
handler._users.get = (requestProperties, callback) => {
    // check the phone number validation
    const phone =
        typeof requestProperties.query.phone === 'string' &&
        requestProperties.query.phone.trim().length === 11
            ? requestProperties.query.phone
            : false;
    if (phone) {
        // search user
        data.read('users', phone, (err, u) => {
            const user = { ...parseJson(u) };
            if (!err && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, { message: 'user not found' });
            }
        });
    } else {
        callback(404, { message: 'invalid phone number' });
    }
};
handler._users.put = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

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

    if (phone) {
        if (firstName || lastName || password) {
            // find user
            data.read('users', phone, (err, u) => {
                const user = { ...parseJson(u) };

                if (!err && user) {
                    if (firstName) {
                        user.firstName = firstName;
                    }
                    if (lastName) {
                        user.lastName = lastName;
                    }
                    if (password) {
                        user.password = hash(password);
                    }
                    // update data base
                    data.update('users', phone, user, (err2) => {
                        if (!err2) {
                            callback(200, {
                                message: 'update successfully',
                            });
                        } else {
                            callback(500, {
                                message: 'error from server to update data',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        message: ' user not found',
                    });
                }
            });
        } else {
            callback(400, {
                message: ' no update field found',
            });
        }
    } else {
        callback(400, {
            message: 'Invalid Phone number',
        });
    }
};
handler._users.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.query.phone === 'string' &&
        requestProperties.query.phone.trim().length === 11
            ? requestProperties.query.phone
            : false;
    if (phone) {
        data.read('users', phone, (error1, readData) => {
            if (!error1 && readData) {
                data.delete('users', phone, (error2) => {
                    if (!error2) {
                        callback(200, {
                            message: 'delete successful',
                        });
                    } else {
                        callback(500, {
                            message: 'problem in deleting data',
                        });
                    }
                });
            } else {
                callback(500, {
                    message: 'couldnt find user',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Invalid phone number',
        });
    }
};

module.exports = handler;
