# organic-plasma-feedback v2.0.0

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

All results from reactions for callback invoke are delivered as chemicals via plasma having the following signature:

```
{
  type: chemical.type + '-result',
  err: Error,
  result: Primitive,
  $feedback_timestamp: Date
}
```

### plasma.on(pattern, handler, context, once)

___arguments___
* `pattern` - the pattern on which to listen for chemicals
  * as `String` - matches against the `Chemical.type` property
  * as `Object` - matches against one or more properties of `Chemical`
* `handler` - `Function` Invoked when a chemical, matching the pattern has been emitted. Invoked with:
  - `c` - `Object` emited `Chemical`
  - `callback` - `Function` _(optional)_ - `function (err, result)`, called to return feedback on the emited chemical. Can be omitted to and the `plasma.on`
* `context` - `Object` _(optional)_ - the context used when invoking the `handler` function
* `once` - `Boolean` _(optional)_ - indicates whether only one chemical will be processed by the `handler` function. After the chemical is processed the handler is unregistered

### Callback usage - plasma.on(pattern, function (c, callback){} [, context][, once])
Registers a function to be triggered when a chemical emitted in the plasma matches the given pattern.

```
plasma.on("test-chemical", function (c, callback){
  // do some processing with `c`
  callback(null, { success: true })
}, undefined, true)
```

### plasma.emit(c, callback)

Immediately triggers any reactions matching the given `c` chemical and provides feedback support via callbacks.

___arguments___
* `c` -  `Object` - to be emmited with the `Chemical` structure
  * as `String` - equals to `{ type: String, ... }` Chemical
  * as `Object` - must follow the `Chemical` structure
* `callback` - `Function` - `function (err, result) {}`

```
plasma.emit({ type: 'test' }, function (err, result) {})
plasma.emit('test', function (err, result) {})
```

### Feedback examples

#### emit and receive callback from the first who respond

```
plasma.on({type: 'c1'}, function (c, callback) {
  callback(err, 'result1')
})
plasma.once({type: 'c1'}, function (c, callback) {
  callback(err, 'result2')
})

var c = {type: 'c1'}
plasma.emit(c, function callback (err, result) {
  // callback will be invoked just once with result === 'result1'
})
```

#### emit and receive callback invocation from all who respond

```
plasma.on({type: 'c1'}, function (c, callback) {
  callback(null, 'result1')
})
plasma.on({type: 'c1'}, function (c, callback) {
  callback(null, 'result2')
})

var c = {type: 'c1', $feedback_timestamp: 'unique-timestamp'}
plasma.emit(c, function callback (err, result) {
  // 1st callback invoke result === 'result1'
  // 2nd callback invoke result === 'result2'
})
```

### Performance notice

This implementation is ~6 times slower than [`organic-plasma v0.0.7`](https://github.com/outbounder/organic-plasma/tree/f2cd53b0eb60ecc9c10d53eb455f182e9bf5a484), however it provides greater control over plasma's feedback support and is aligned to its pattern in nature.
