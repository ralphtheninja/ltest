var hyper = require('leveldown-hyper')
var test = require('tape')
var ltest = require('../')({ db: hyper }, test)
ltest('leveldown-hyper backend', function (t, db, createReadStream) {
  var key = 'beep'
  var value = 'boop'
  db.put(key, value, function (err) {
    t.ok(!err, 'no put error')
    db.get(key, function (err, _value) {
      t.equal(_value, value)
      db.db.liveBackup(Date.now(), function (err) {
        t.notOk(err, 'liveBackup worked')
        t.end()
      })
    })
  })
})
