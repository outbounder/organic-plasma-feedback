# organic-plasma-feedback

Provide syntax sugar on top of [organic-plasma](https://github.com/outbounder/organic-plasma) implementations with feedback support.

## usage

```
var Plasma = require('organic-plasma')
var plasma = require('organic-plasma-feedback")(new Plasma())

plasma.on('chemical1', function (c, callback) {
  // do work
  callback(err, {success: true})
})

plasma.emit('chemical1', function (err, result) {
  // result.success === true
})
```

## API

All results from reactions (either callback invoke or returned promise) are delivered as chemicals via plasma having the following signature:

```
{type: chemical.type + 'reasult', err: Error, result: Object}
```

### plasma.on(pattern, function (c, callback){} [, context])

Registers a function to be triggered when chemical emitted in plasma matches given pattern.

* `pattern` argument
  * as `String` matching `Chemical.type` property
  * as `Object` matching one or many properties of `Chemical`
* `c` argument - `Object` Chemical matching `pattern`
* `callback` argument - `function (err, result)`, called to return feedback
* `context` optional argument - will be used to invoke function reaction within context

### plasma.on(pattern, function (c){} [, context])

Registers a function to be triggered when chemical emitted in plasma matches given pattern.

* `pattern` argument
  * as `String` matching `Chemical.type` property
  * as `Object` matching one or many properties of `Chemical`
* `c` argument - `Object` Chemical matching `pattern`
* `context` optional argument - will be used to invoke function reaction within context
* `function` reaction returns `Promise` as feedback

### plasma.emit(c, callback)

Immediatelly triggers any reactions matching given `c` chemical and provides feedback support via callbacks

* `c` argument
  * as `String` equals to `{ type: String, ... }` Chemical
  * as `Object` equals to Chemical
* `callback` argument - `function (err, result) {}`

### plasma.emit(c)

Immediatelly triggers any reactions matching given `c` chemical and provides feedback support via Promise

* `c` argument
  * as `String` equals to `{ type: String, ... }` Chemical
  * as `Object` equals to Chemical
* `returns` Promise

### feedback support

The modes are supported separately or mixed.

#### Promises mode

```
plasma.on(pattern, function (c) {
  return Promise
})
plasma.once(pattern, function (c) {
  return Promise
})

plasma.react(c)
  .then(function (results) {})
  .catch(function (err) {})
```

#### Callbacks mode

```
plasma.on(pattern, function (c, callback) {
  callback(err, data)
})
plasma.once(pattern, function (c, callback) {
  callback(err, data)
})

plasma.react(c, function callback(err, data) {})
```

## Performance notice

This implementation is ~4 times slower than `organic-plasma v0.0.7`, however it provides greater control over plasma's feedback support and is aligned to its pattern in nature.
