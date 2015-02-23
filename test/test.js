var fs = require('fs')
var test = require('tape')
var ltest = require('../')
var util = require('core-util-is')

test('invalid test function throws', function (t) {
  t.throws(function () {
    ltest({ test: 'this is not a test function' })
  }, /invalid test function/)
  t.end()
})

test('missing callback throws', function (t) {
  var lt = ltest({ test: function (name, cb) { cb({}) } })
  t.throws(function () {
    lt('this is an invalid test because no callback')
  }, /missing test callback/)
  t.end()
})

test('test framework must support end method', function (t) {
  var lt = ltest({ test: function (name, cb) { cb({}) } })
  t.throws(function () {
    lt('this is an invalid test', function () {})
  }, /missing t.end/)
  t.end()
})

test('test framework must support ok method', function (t) {
  var lt = ltest({
        test: function (name, cb) {
          cb({ end: function () {} })
        }
      })
  t.throws(function () {
    lt('this is an invalid test', function () {})
  }, /missing t.ok/)
  t.end()
})

test('valid test framework does not throw', function (t) {
  var lt = ltest({
        test: function (name, cb) {
          cb({
            end: function () {},
            ok: function () {}
          })
        }
      })
  t.doesNotThrow(function () {
    lt('this is a valid test', function () {})
  })
  t.end()
})

test('valid test calls back with t, db and createReadStream', function (t) {
  var lt = ltest({
        test: function (name, cb) {
          cb({
            end: function () {},
            ok: function () {}
          })
        }
      })
  lt('this is a valid test', function (_t, db, createReadStream) {
    t.ok(util.isObject(_t))
    t.ok(util.isObject(db))
    t.ok(util.isFunction(createReadStream))
    t.end()
  })
})

test('valid db exists on disk and is cleaned up after test', function (t) {
  var location
  var lt = ltest({
        test: function (name, cb) {
          cb({
            end: function () {
              fs.stat(location, function (err, stats) {
                t.ok(err, 'the location should be gone')
                t.notOk(stats, 'no stats')
                t.end()
              })
            },
            ok: function (bool, msg) {
              // reuse some tests from ltest .. ;)
              t.ok(bool, msg)
            }
          })
        }
      })
  lt('this is a valid test', function (_t, db, createReadStream) {
    location = db.location
    t.ok(typeof location == 'string', 'should be a string')
    t.ok(location.match(/level-test-\d{13}$/), 'ends with a timestamp')
    fs.stat(location, function (err, stats) {
      t.ok(!err, 'no error on stating db.location')
      t.ok(stats && stats.isDirectory(), 'should be a folder')
      _t.end()
    })
  })
})


