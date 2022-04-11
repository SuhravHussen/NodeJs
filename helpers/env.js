const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'staging',
    maxChecks: 5,
    twilio: {
        fromPhone: '+18644774151',
        accountSid: 'AC11e9d4e0b8c1420e7d220fb1fdea8d14',
        authToken: '25cd890c583b8da7fc876061d7c65fbb',
    },
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'production',
    maxChecks: 5,
    twilio: {
        fromPhone: '+18644774151',
        accountSid: 'AC11e9d4e0b8c1420e7d220fb1fdea8d14',
        authToken: '25cd890c583b8da7fc876061d7c65fbb',
    },
};

// check stage
// eslint-disable-next-line prettier/prettier
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
// eslint-disable-next-line prettier/prettier
const environmentToExport = typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

module.exports = environmentToExport;
