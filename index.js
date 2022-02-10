/*
 Title : Uptime monitoring application
Description : A RESTFul API to monitor up or down time of use defined links
*/

// dependencies
const http = require('http');
const { handleRedRes } = require('./helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(handleRedRes);
    server.listen(app.config.port, () => {
        console.log('Listening to port number', app.config.port);
    });
};

// handle request and response
app.createServer();
