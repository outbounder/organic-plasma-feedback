var async = require('async')
var Plasma = require('./node_modules/organic-plasma')
var plasma = new Plasma()

console.time('v0.0.7')
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
  console.timeEnd('v0.0.7')
})
