const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000; // port in which we want our code to run

const server = http.createServer(app)

server.listen(port);