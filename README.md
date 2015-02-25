# ltest [![Build Status](https://travis-ci.org/ralphtheninja/ltest.svg?branch=master)](https://travis-ci.org/ralphtheninja/ltest)

A test function that:

* Sets up a fresh temporary `levelup` instance.
* Calls back with `t`, `db` and `createReadStream`.
* Closes `db` and removes files when a test ends via `t.end()`.
* Adds tests to make sure `db` is opened, closed and removed properly.
* Supports multiple `levelup` backends via [`level-test`](https://github.com/dominictarr/level-test), which also has built in support for `MemDOWN`. Default is `leveldown`.
* Supports any test framework that has a test function and `t.end` and `t.ok` methods.

Extracted from the test code in [`level-ttl`](https://github.com/rvagg/node-level-ttl) and made more generic.

## Install

```
$ npm install ltest --save
```

## Usage

```js
var tape = require('tape')
var test = require('ltest')(tape)
test('put and stream', function (t, db, createReadStream) {
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
        t.end() // <-- will close the db and delete files
      })
  })
})
```

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

#### `ltest([options, ]testFn)`

Returns a test function of the form `function (desc[, opts], cb)` where `desc` is the test description, `opts` is an optional options object passed to underlying `db` and `cb` is a callback of the form `function (t, db, createReadStream)`.

`options` object is optional and is passed on to `levelup` and to `level-test`. Use this to define things like `'keyEncoding'` or other settings for `levelup`.

Set `options.mem` to `true` if you want an in memory db.

`testFn` is the test function that should be used. Use any framework you like as long as it's a function and supports `t.end` and `t.ok` methods.

```js
var ltest = require('ltest')(require('tape'))
```

or

```js
var ltest = require('ltest')(require('tap').test)
```

## License
MIT
