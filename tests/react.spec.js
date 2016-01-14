var Plasma = require('organic-plasma')

describe('react', function () {
  var instance
  beforeEach(function () {
    instance = require("../index")(new Plasma())
  })
  it('works with callbacks', function (done) {
    instance.on('do work', function (c, next) {
      next(null, c)
    })
    instance.emit('do work', function (err, result) {
      expect(result.type).toBe('do work')
      done()
    })
  })
  it('works with failed callbacks', function (done) {
    instance.on('do work', function (c, next) {
      next(new Error('bla'), c)
    })
    instance.emit('do work', function (err, result) {
      expect(err.message).toBe('bla')
      expect(result.type).toBe('do work')
      done()
    })
  })
})
