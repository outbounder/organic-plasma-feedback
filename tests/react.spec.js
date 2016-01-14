var Plasma = require('../index')(require('organic-plasma'))

describe('react', function () {
  it('works with callbacks', function (done) {
    var plasma = new Plasma()

    plasma.on('do work', function (c, next) {
      next(null, c)
    })
    plasma.emit('do work', function (err, result) {
      expect(result.type).toBe('do work')
      done()
    })
  })
  it('works with failed callbacks', function (done) {
    var plasma = new Plasma()

    plasma.on('do work', function (c, next) {
      next(new Error('bla'), c)
    })
    plasma.emit('do work', function (err, result) {
      expect(err.message).toBe('bla')
      expect(result.type).toBe('do work')
      done()
    })
  })
})
