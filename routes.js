/*
Routes

*/

// dependencies
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { notFound } = require('./handlers/routeHandlers/notfoundHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');

const routes = {
    user: userHandler,
    notFound,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = routes;
