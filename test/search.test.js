var Code = require('code')
var Lab = require('lab')
var Seneca = require('seneca')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect


describe('search', function() {

    it('query', function(done) {
        var q = 'q' + (('' + Math.random()).substring(2))

        Seneca()
            .test(done)
            .use('..')
            .gate()
            .act('role:suggest,cmd:add,query:' + q)
            .act('role:suggest,cmd:suggest,query:' + q.substring(0, q.length / 2),
                function(ignore, out) {
                    expect(out[0]).to.equal(q)
                    done()
                })
    })


    it('happy', { timeout: 7777 }, function(done) {
        var mod = 'mod' + ((Math.random() + '').substring(2))

        require('wreck').get('http://192.168.99.100:9200/', function(err, res, payload) {
            console.log(payload.toString())
        })

        var seneca = Seneca()

        seneca
            .test(done)

        // Uncomment if you want to see detailed logs
        .test(done, 'print')

        // Load the search plugin
        .use('..')

        .act(
            'role:search,cmd:insert', {
                data: {
                    name: mod,
                    version: '0.0.1',
                    desc: mod,
                    id: mod
                }
            },
            function(ignore, out) {
                expect(out._id).to.equal(mod)
            })

        setTimeout(function() {
            seneca.act('role:search,cmd:search,query:' + mod, function(ignore, out) {
                expect(out.items[0].name).to.equal(mod)
                expect(out.items[0].id).to.equal(mod)

                done()
            })
        }, 3333)
    })
})