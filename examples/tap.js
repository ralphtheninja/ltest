var test = require('tap').test
var ltest = require('../')(test)
ltest('using tap instead of tape should work', function (t, db, createReadStream) {
  db.put('foo', 'bar', function (err) {
    t.ok(!err, 'no put error')
    db.get('foo', function (err, _value) {
      t.equal(_value, 'bar')
      t.end()
    })
  })
})
