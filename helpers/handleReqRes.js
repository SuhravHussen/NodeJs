/*
title : Handle Request and Response
Description: Handle request and response
*/

// dependencies
const { URL } = require('url');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFound } = require('../handlers/routeHandlers/notfoundHandler');
// module scaffolding
const handler = {};

handler.handleRedRes = (req, res) => {
    // request handling
    // get the url and parse it
    const parsedUrl = new URL(`http://${req.headers.host}${req.url}`);
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const { query } = url.parse(req.url, true);
    const { headers } = req;
    const requestProperties = {
        parsedUrl,
        path,
        method,
        query,
        headers,
    };
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[path] ? routes[path] : notFound;
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);
        chosenHandler(requestProperties, (statusCode, payload) => {
            // eslint-disable-next-line no-param-reassign
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            // eslint-disable-next-line no-param-reassign
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            // return the final response
            res.writeHead(statusCode);
            res.end(payloadString);
        });
        // response handle
        res.end('hello world');
    });
};

module.exports = handler;
