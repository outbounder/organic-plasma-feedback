var plasmaWithFeedbackVersion = require('./package.json').version
module.exports = function (originalPlasma) {
  if (originalPlasma.$plasmaWithFeedbackVersion) {
    if (originalPlasma.$plasmaWithFeedbackVersion !== plasmaWithFeedbackVersion) {
      console.warn('given plasma already has feedback but with different version',
        originalPlasma.$plasmaWithFeedbackVersion, '<!-->', plasmaWithFeedbackVersion)
    }
    return originalPlasma
  }
  var plasmaWithFeedback = {
    $plasmaWithFeedbackVersion: plasmaWithFeedbackVersion
  }
  for (var key in originalPlasma) {
    plasmaWithFeedback[key] = originalPlasma[key]
  }

  plasmaWithFeedback.on = function (pattern, handler, context, once) {
    if (Array.isArray(pattern)) {
      return originalPlasma.on(pattern, handler, context, once)
    }
    if (typeof pattern === 'string') {
      pattern = {type: pattern}
    }

    var reactionFn = handler
    if (handler.length === 2) { // has callback
      reactionFn = function (c) {
        var chemicalType = c.type
        return handler.call(context, c, function (err, result) {
          originalPlasma.emit({
            type: chemicalType + '-result',
            $feedback_timestamp: c.$feedback_timestamp,
            err: err,
            result: result
          })
        })
      }
    }

    originalPlasma.on(pattern, reactionFn, context, once)
  }

  plasmaWithFeedback.emit = function (input, callback) {
    var chemical
    if (typeof input === 'string') {
      chemical = {type: input}
    } else {
      chemical = {}
      for (var key in input) {
        chemical[key] = input[key]
      }
    }

    if (callback) {
      if (!chemical.$feedback_timestamp) {
        chemical.$feedback_timestamp = (new Date()).getTime() + Math.random()
        originalPlasma.once({
          type: chemical.type + '-result',
          $feedback_timestamp: chemical.$feedback_timestamp
        }, function (c) {
          callback(c.err, c.result)
        })
      } else {
        originalPlasma.on({
          type: chemical.type + '-result',
          $feedback_timestamp: chemical.$feedback_timestamp
        }, function (c) {
          callback(c.err, c.result)
        })
      }
      originalPlasma.emit(chemical)
    } else {
      originalPlasma.emit(chemical)
    }
  }

  return plasmaWithFeedback
}
