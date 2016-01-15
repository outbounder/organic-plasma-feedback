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
        handler.call(context, c, function (err, result) {
          plasma.emit.call(plasma, {
            type: chemicalType+'result',
            err: err,
            result: result
          })
        })
      }
    } else {
      reactionFn = function (c) {
        var chemicalType = c.type
        var promise = handler.call(context, c)
        if (promise instanceof Promise) {
          promise.then(function (result) {
            plasma.emit.call(plasma, {
              type: chemicalType+'result',
              err: null,
              result: result
            })
          })
          promise.catch(function (err) {
            plasma.emit.call(plasma, {
              type: chemicalType+'result',
              err: err,
              result: null
            })
          })
        }
      }
    }

    plasma.on.call(plasma, pattern, reactionFn, undefined, once)
  }

  plasmaWithFeedback.emit = function (chemical, callback) {
    if(typeof chemical == "string")
      chemical = {type: chemical}

    if (callback) {
      plasma.once.call(plasma, chemical.type+'result', function (c) {
        callback(c.err, c.result)
      }, undefined, true)
      plasma.emit.call(plasma, chemical)
    } else {
      return new Promise(function (promiseResolve, promiseReject) {
        plasma.once.call(plasma, chemical.type+'result', function (c) {
          if (c.err) return promiseReject(c.err)
          promiseResolve(c.result)
        }, undefined, true)
        plasma.emit.call(plasma, chemical)
      })
    }
  }

  return plasmaWithFeedback
}
