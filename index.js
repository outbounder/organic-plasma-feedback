module.exports = function (Plasma) {
  var plasmaOn = Plasma.prototype.on
  var plasmaEmit = Plasma.prototype.emit
  var PlasmaAlchemy = function () {
    Plasma.call(this)
  }
  PlasmaAlchemy.prototype = new Plasma

  PlasmaAlchemy.prototype.on = function (pattern, handler, context, once) {
    if(Array.isArray(pattern)) {
      return plasmaOn.call(this, pattern, handler, context, once)
    }
    if (typeof pattern == "string")
      pattern = {type: pattern}

    var reactionFn = handler
    var self = this
    if (handler.length === 2) { // has callback
      reactionFn = function (c) {
        var chemicalType = c.type
        handler(c, function (err, result) {
          plasmaEmit.call(self, {
            type: chemicalType+'result',
            err: err,
            result: result
          })
        })
      }
    } else {
      reactionFn = function (c) {
        var chemicalType = c.type
        var promise = handler(c)
        if (promise instanceof Promise) {
          promise.then(function (result) {
            plasmaEmit.call(self, {
              type: chemicalType+'result',
              err: null,
              result: result
            })
          })
          promise.catch(function (err) {
            plasmaEmit.call(self, {
              type: chemicalType+'result',
              err: err,
              result: null
            })
          })
        }
      }
    }
    plasmaOn.call(this, pattern, reactionFn, context, once)
  }

  PlasmaAlchemy.prototype.emit = function (chemical, callback) {
    if(typeof chemical == "string")
      chemical = {type: chemical}

    if (callback) {
      plasmaOn.call(this, chemical.type+'result', function (c) {
        callback(c.err, c.result)
      }, undefined, true)
      plasmaEmit.call(this, chemical)
    } else {
      var promiseResolve
      var promiseReject
      var p = new Promise(function (resolve, reject) {
        promiseResolve = resolve
        promiseReject = reject
      })
      plasmaOn.call(this, chemical.type+'result', function (c) {
        if (c.err) return promiseReject(c.err)
        promiseResolve(c.result)
      }, undefined, true)
      plasmaEmit.call(this, chemical)
      return p
    }
  }

  return PlasmaAlchemy
}
