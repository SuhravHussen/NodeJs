// DEPENDENCIES
const crypto = require('crypto');
const environment = require('./env');

const utilities = {};
// parse json string to object
utilities.parseJson = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};
// hash string data
// eslint-disable-next-line consistent-return
utilities.hash = (string) => {
    if (typeof string === 'string' && string.length > 0) {
        const hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(string)
            .digest('hex');
        return hash;
    }
};

// create random string
utilities.randomString = (stringLength) => {
    let length = stringLength;
    length = typeof stringLength === 'number' && stringLength > 0 ? stringLength : false;
    if (length) {
        const possibleCharacter = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomCharacter = possibleCharacter.charAt(
                Math.floor(Math.random() * possibleCharacter.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;
};
// module export
module.exports = utilities;
