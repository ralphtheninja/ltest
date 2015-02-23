var LevelUp = require('level-test')
var rmrf = require('rimraf')

module.exports = function (opts) {
  opts = opts || {}
  var test = opts.test || require('tape')

  throwIfNotFunction(test, 'invalid test function')

  return function (desc, callback) {

    throwIfNotFunction(callback, 'missing test callback')

    test(desc, function (t) {

      throwIfNotFunction(t.end, 'missing t.end')
      throwIfNotFunction(t.ok, 'missing t.ok')

      var dbName = 'level-test-' + Date.now()
      var levelup = LevelUp(opts)

      levelup(dbName, opts, function (err, db) {
        t.ok(!err, 'no error on open()')
        t.ok(db, 'valid db object')

        var location = db.location
        var end = t.end

        t.end = function () {
          db.close(function (err) {
            t.ok(!err, 'no error on close()')
            rmrf(location, function (err) {
              t.ok(!err, 'db removed')
              end.call(t)
            })
          })
        }

        // Now everything is setup to test the db!
        callback(t, db, db.createReadStream.bind(db))

      })

    })

  }

}

function throwIfNotFunction(fn, msg) {
  if (typeof fn != 'function') throw new Error(msg)
}
