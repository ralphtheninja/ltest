# ltest [![Build Status](https://travis-ci.org/ralphtheninja/ltest.svg?branch=master)](https://travis-ci.org/ralphtheninja/ltest)

A test function that:

* Sets up a fresh temporary `levelup` instance.
* Calls back with `t`, `db` and `createReadStream`.
* Closes `db` and removes files when a test ends via `t.end()`.
* Adds tests to make sure `db` is opened, closed and removed properly.
* Supports multiple `levelup` backends via [`level-test`](https://github.com/dominictarr/level-test). Default is `leveldown`.
* Supports any test framework that has a test function and `t.end` and `t.ok` methods. Defaults is `tape`.

Extracted from the test code in [`level-ttl`](https://github.com/rvagg/node-level-ttl) and made more generic.

## Install

```
$ npm install ltest --save
```

## Usage

```js
var ltest = require('./')()
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
```

Output

```
TAP version 13
# put and stream
ok 1 no error on open()
ok 2 valid db object
ok 3 no put error
ok 4 should be equal
ok 5 should be equal
ok 6 should be equal
ok 7 no error on close()
ok 8 db removed

1..8
# tests 8
# pass  8

# ok
```

## Api

#### `ltest([options])`

Returns a test function of the form `function (desc, cb)` where `desc` is the test description and `cb` is a callback of the form `function (t, db, createReadStream)`.

## License
MIT
