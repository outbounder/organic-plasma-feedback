var Plasma = require('organic-plasma')

describe('plasma on / emit feature', function () {
  var instance
  beforeEach(function () {
    instance = require('../index')(new Plasma())
  })
  it('works with callbacks', function (done) {
    instance.on('c1', function (c, next) {
      expect(c.type).toBe('c1')
      next(null, {success: true})
    })
    instance.emit({type: 'c1'}, function (err, data) {
      if (err) return done(err)
      expect(data.success).toBe(true)
      done()
    })
  })
})
