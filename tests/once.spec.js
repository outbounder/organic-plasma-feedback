var Plasma = require("organic-plasma")

describe("plasma once", function(){
  var instance
  beforeEach(function () {
    instance = require("../index")(new Plasma())
  })
  it("plasma.once receives only one chemical", function(done){
    var chemicalsProcessed = 0
    instance.once("c1", function(c, next){
      expect(c.type).toBe("c1")
      chemicalsProcessed ++
      next(null, {success: true})
    })

    instance.emit({type: "c1"}, function (err, data) {
      expect(data.success).toBe(true)

      var secondCallbackHit = false
      instance.emit({type: "c1"}, function(err, data) {
        secondCallbackHit = true
      })

      setTimeout(function() {
        expect(chemicalsProcessed).toBe(1)
        expect(secondCallbackHit).toBe(false)
        done()
      }, 100)
    })
  })
})
