/*
Routes

*/

// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { notFound } = require('./handlers/routeHandlers/notfoundHandler');

const routes = {
    sample: sampleHandler,
    notFound,
};

module.exports = routes;
