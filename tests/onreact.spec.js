var Plasma = require("organic-plasma")

describe("plasma on / emit feature", function(){
  var instance
  beforeEach(function () {
    instance = require("../index")(new Plasma())
  })
  it("works with callbacks", function(done){
    instance.on("c1", function(c, next){
      expect(c.type).toBe("c1")
      next(null, {success: true})
    })
    instance.emit({type: "c1"}, function (err, data) {
      expect(data.success).toBe(true)
      done()
    })
  })
  it("works with promises", function(done){
    instance.on("c1", function(c){
      expect(c.type).toBe("c1")
      return Promise.resolve({success: true})
    })
    instance.emit({type: "c1"}).then(function (data) {
      expect(data.success).toBe(true)
      done()
    })
  })
  it("works with promises flattened", function(done){
    instance.on("c1", function(c){
      expect(c.type).toBe("c1")
      c.success1 = true
      return Promise.resolve(c)
    })
    instance.on("c1", function(c){
      expect(c.type).toBe("c1")
      c.success2 = true
      return Promise.resolve(c)
    })
    instance.emit({type: "c1"}).then(function (data) {
      expect(data.success1).toBe(true)
      expect(data.success2).toBe(true)
      done()
    })
  })
  it("works with callbacks -> promises", function (done) {
    instance.on("c1", function(c, callback){
      expect(c.type).toBe("c1")
      callback(null, {success: true})
    })
    instance.emit({type: "c1"}).then(function (data) {
      expect(data.success).toBe(true)
      done()
    })
  })
  it("works with promises -> callbacks", function (done) {
    instance.on("c1", function(c){
      expect(c.type).toBe("c1")
      return Promise.resolve({success: true})
    })
    instance.emit({type: "c1"}, function (err, data) {
      expect(data.success).toBe(true)
      done()
    })
  })
  it("works with callbacks -> promises -> callbacks", function (done) {
    instance.on("c2", function(c, callback){
      expect(c.type).toBe("c2")
      c.success2 = true
      callback(null, c)
    })
    instance.on("c1", function(c){
      expect(c.type).toBe("c1")
      c.success = true
      c.type = "c2"
      return instance.emit(c)
    })
    instance.emit({type: "c1"}, function (err, data) {
      expect(data.success).toBe(true)
      expect(data.success2).toBe(true)
      done()
    })
  })
  it("works with promises -> callbacks -> promises", function (done) {
    instance.on("c2", function(c){
      expect(c.type).toBe("c2")
      c.success2 = true
      return Promise.resolve(c)
    })
    instance.on("c1", function(c, callback){
      expect(c.type).toBe("c1")
      c.success = true
      c.type = "c2"
      instance.emit(c, callback)
    })
    instance.emit({type: "c1"}).then(function (data) {
      expect(data.success).toBe(true)
      expect(data.success2).toBe(true)
      done()
    })
  })
})
