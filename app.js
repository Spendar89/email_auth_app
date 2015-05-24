'use strict'

var express = require('express'),
    http = require('http'),
    path = require('path'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    routes = require('./server/routes.js'),
    app = express();

app.set('port', process.env.PORT || 8000);
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);

var server = http.createServer(app);

server.listen(app.get('port'), function() {
    let p =  app.get('port');
    console.log(`Express server listening on port ${p}`);
});
