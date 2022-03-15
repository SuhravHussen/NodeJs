// module scaffolding
const handler = {};

handler.notFound = (requestProperties, callback) => {
    callback(404, {
        message: 'Not Found 404!',
    });
};

module.exports = handler;
