/*
Routes

*/

// dependencies
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { notFound } = require('./handlers/routeHandlers/notfoundHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');

const routes = {
    user: userHandler,
    notFound,
    token: tokenHandler,
};

module.exports = routes;
