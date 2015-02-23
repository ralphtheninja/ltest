var test = require('tape')
var ltest = require('../')({ mem: true }, test)
ltest('in memory', function (t, db, createReadStream) {
  var batch = [
    { type: 'put', key: 'key1', value: 'value1' },
    { type: 'put', key: 'key2', value: 'value2' },
    { type: 'put', key: 'key3', value: 'value3' }
  ]
  db.batch(batch, function (err) {
    t.ok(!err, 'no batch error')
    var count = 0
    createReadStream()
      .on('data', function (data) {
        ++count
      })
      .on('end', function () {
        t.equal(count, 3)
        t.end()
      })
  })
})
