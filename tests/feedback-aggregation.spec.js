var Plasma = require('organic-plasma')

describe('feedback aggregation', function () {
  var instance = require("../index")(new Plasma())

  it('multiple listeners returning true are not hit simultaniously', function (done) {
    var handled = 0

    instance.on('simultanious', function (c, next) {
      handled ++
      next(null, 1)
      return true
    })
    instance.on('simultanious', function (c, next) {
      handled ++
      next(null, 2)
      return true
    })

    instance.emit('simultanious', function (err, result) {
      expect(result).toBe(1)
      setTimeout(function() {
        expect(handled).toBe(1)
        return done()
      }, 100)
    })
  })
})
