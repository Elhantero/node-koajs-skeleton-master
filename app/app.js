"use strict";
const Koa = require('koa'),
    config = require('config'),
    convert = require('koa-convert'),
    passport = require('./helpers/passport')

const app = new Koa();

const Memcached = require('memcached'),
    memcached = new Memcached();

memcached.connect('127.0.0.1:11211', function (err, conn) {
    if (err) {
        console.log(conn.server);
    }
});

//Comment this line to disable sessions
require('./helpers/session')(app);

//Comment this line to disable koa-body-parser
require('./helpers/bodyparser')(app);

require('./helpers/render')(app);

app.use(passport.initialize());
app.use(passport.session());

require('./routes')(app, passport);

app.listen(config.server.port, function () {
    console.log('%s listening at port %d', config.app.name, config.server.port);
});
