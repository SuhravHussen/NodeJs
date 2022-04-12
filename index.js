/*
Title : Initial File
Description : Initial File to  start the node server
*/

// dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');

const app = {};

app.init = () => {
    // start the server
    server.init();

    // start the workers
    workers.init();
};

app.init();
