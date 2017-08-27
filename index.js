'use strict';
let config = require('config');
var ELASTIC = config.get('elasticSearchUrl') || 'localhost';
var Seneca = require('seneca')

const amqpUrl = config.has("rabbitmqCloudUrl") ? config.get("rabbitmqCloudUrl") : `amqp://${config.get('rabbitmq.username')}:${config.get('rabbitmq.password')}@${config.get('rabbitmq.host')}:${config.get('rabbitmq.port')}`;
const patternPin = 'role:search';


Seneca({ tag: 'search' })
    .use('seneca-amqp-transport')
    .listen({
        type: 'amqp',
        url: amqpUrl,
        pin: patternPin
    })
    .test('print')
    .use('./lib/search.js', {
        elastic: {
            host: ELASTIC
        }
    });
/*.ready(function() {
    this.add('role:search,cmd:search', function(msg, reply) {
        this.prior(msg, reply)
            //  this.act('role:suggest,cmd:add', { query: msg.query, default$: {} })
    })
})*/