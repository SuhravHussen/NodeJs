/* eslint-disable no-underscore-dangle */
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');

// module scaffolding
const handler = {};
handler.userHandler = (requestProperties, callback) => {
    console.log(requestProperties);
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
    callback(200, {
        message: 'This is a user url',
    });
};
handler._users.put = (requestProperties, callback) => {};
handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
