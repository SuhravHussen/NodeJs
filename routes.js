/*
Routes

*/

// dependencies
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { notFound } = require('./handlers/routeHandlers/notfoundHandler');

const routes = {
    user: userHandler,
    notFound,
};

module.exports = routes;
