module.exports = function (plasma) {
  var plasmaWithFeedback = {}
  for (var key in plasma)
    plasmaWithFeedback[key] = plasma[key]

  plasmaWithFeedback.on = function (pattern, handler, context, once) {
    if(Array.isArray(pattern)) {
      return plasma.on.call(plasma, pattern, handler, context, once)
    }
    if (typeof pattern == "string")
      pattern = {type: pattern}

    var reactionFn = handler
    if (handler.length === 2) { // has callback
      reactionFn = function (c) {
        var chemicalType = c.type
        return handler.call(context, c, function (err, result) {
          plasma.emit.call(plasma, {
            type: chemicalType + '-result',
            $feedback_timestamp: c.$feedback_timestamp,
            err: err,
            result: result
          })
        })
      }
    } else {
      reactionFn = function (c) {
        var chemicalType = c.type
        var result = handler.call(context, c)
        if (result instanceof Promise) {
          result.then(function (result) {
            plasma.emit.call(plasma, {
              type: chemicalType + '-result',
              $feedback_timestamp: c.$feedback_timestamp,
              err: null,
              result: result
            })
          })
          result.catch(function (err) {
            plasma.emit.call(plasma, {
              type: chemicalType + '-result',
              $feedback_timestamp: c.$feedback_timestamp,
              err: err,
              result: null
            })
          })
        }
        return result
      }
    }

    plasma.on.call(plasma, pattern, reactionFn, undefined, once)
  }

  plasmaWithFeedback.emit = function (input, callback) {
    var chemical
    if(typeof input == "string") {
      chemical = {type: input}
    } else {
      chemical = {}
      for (var key in input) {
        chemical[key] = input[key]
      }
    }

    chemical.$feedback_timestamp = (new Date()).getTime() + Math.random()

    if (callback) {
      plasma.once.call(plasma, {
        type: chemical.type + '-result',
        $feedback_timestamp: chemical.$feedback_timestamp
      }, function (c) {
        callback(c.err, c.result)
      })
      plasma.emit.call(plasma, chemical)
    } else {
      return new Promise(function (promiseResolve, promiseReject) {
        plasma.once.call(plasma, {
          type: chemical.type + '-result',
          $feedback_timestamp: chemical.$feedback_timestamp
        }, function (c) {
          if (c.err) return promiseReject(c.err)
          promiseResolve(c.result)
        })
        plasma.emit.call(plasma, chemical)
      })
    }
  }

  return plasmaWithFeedback
}
