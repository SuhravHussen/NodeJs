/*
 Title : Server Library
Description : Server Related Files
*/

// dependencies

const http = require('http');
const { handleRedRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/env');

const server = {};
// handle request and response
server.handleReqRes = handleRedRes;

// create server
server.createServer = () => {
    const createServer = http.createServer(server.handleRedRes);
    createServer.listen(environment.port, () => {
        console.log('Listening to port number', environment.port);
    });
};

//  start the server
server.init = () => {
    server.createServer();
};

module.exports = server;
