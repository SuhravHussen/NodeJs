/*
 Title : Uptime monitoring application
Description : A RESTFul API to monitor up or down time of use defined links
*/

// dependencies
const http = require('http');
const { handleRedRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/env');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};
data.create('test', 'newFile', { name: 'Bangladesh' }, (err) => {
    console.log('console index file');
    console.log('error is', err);
});

// create server
app.createServer = () => {
    const server = http.createServer(handleRedRes);
    server.listen(environment.port, () => {
        console.log('Listening to port number', environment.port);
    });
};

// handle request and response
app.createServer();
