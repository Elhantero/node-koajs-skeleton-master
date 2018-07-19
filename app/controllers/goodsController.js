/**
 * Goods Controller
 * @module controllers/goodsController
 */
'use strict';

const co = require('co');

const Memcached = require('memcached');
const memcached = new Memcached();

module.exports = {
    getGoods: async function getGoods(ctx, next) {
        ctx.body = await memcached.get(ctx.params.id, function (err, data) {
            if (err) throw err;
            console.log(data);
        });
        ctx.status = 200;
        console.log(ctx.status);
        await next();
    },

    setGoods: async function setGoods(ctx, next) {
        // function for creating random string key for memcache set item
        function str_rand() {
            let result = '';
            let words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
            let max_position = words.length - 1;
            for (var i = 0; i < 5; ++i) {
                let position = Math.floor(Math.random() * max_position);
                result = result + words.substring(position, position + 1);
            }
            return result;
        };

        let randomKey = str_rand();

        ctx.body = await memcached.set(randomKey, ctx.request.body, 10000, function (err) {
            err ? ctx.status = 400 : ctx.status = 201;
            console.log(`MC key: ${randomKey}, MC value : ${ctx.request.body}`);
            console.log(`Please, use this key ${randomKey} for get data`);
        });
        ctx.status = 201;
        console.log(ctx.status);
        await next();
    },

    delGoods: async function delGoods(ctx, next) {
        ctx.body = await memcached.del(ctx.params.id, function (err) {
            err ? ctx.status = 400 : ctx.status = 204;
        });
        ctx.status = 204;
        console.log(ctx.status);
        await next();
    }

};

