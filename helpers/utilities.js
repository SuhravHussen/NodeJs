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

// module export
module.exports = utilities;
