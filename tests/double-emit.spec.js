var Plasma = require('organic-plasma')

describe('double-emit', function () {
  var instance
  beforeEach(function () {
    instance = require("../index")(new Plasma())
  })
  it('works with double emit', function (done) {
    var handled = 0
    var captureAndDone = function () {
      handled += 1
      if (handled === 2) done()
    }
    instance.on('do work', function (c, next) {
      setTimeout(function () {
        next(null, c)
      }, Math.random()*10)
    })
    instance.emit({ type: 'do work', flag: 1}, function (err, result) {
      expect(result.type).toBe('do work')
      expect(result.flag).toBe(1)
      captureAndDone()
    })
    instance.emit({ type: 'do work', flag: 2}, function (err, result) {
      expect(result.type).toBe('do work')
      expect(result.flag).toBe(2)
      captureAndDone()
    })
  })
})
