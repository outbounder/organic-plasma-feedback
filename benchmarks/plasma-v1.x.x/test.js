var async = require('async')
var Plasma = require('organic-plasma')
var plasma = require('../../index')(new Plasma())

console.time('v1.0.0')
plasma.on('do work', function (c, next) {
  next(null, c)
})
var elements = []
for (var i = 0; i<10000; i++)
  elements.push(i)
async.each(elements, function (e, done) {
  plasma.emit('do work', function (err, result) {
    done()
  })
}, function () {
  console.timeEnd('v1.0.0')
})
