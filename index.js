require('newrelic');

var server = require('./server/server.js')

server.setup({});
server.listen();