var test = require('tape')
var ltest = require('../')(test)
ltest('put and stream', function (t, db, createReadStream) {
  db.put('foo', 'bar', function (err) {
    t.ok(!err, 'no put error')
    var count = 0
    createReadStream()
      .on('data', function (data) {
        t.equal(data.key, 'foo')
        t.equal(data.value, 'bar')
        ++count
      })
      .on('end', function () {
        t.equal(count, 1)
        t.end()
      })
  })
})
