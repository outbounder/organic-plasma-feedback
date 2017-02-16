var Plasma = require('organic-plasma')
var plasma = require('../index')(new Plasma())
var async = require('async')

plasma.on('test-chemical', function (c, next) {
  console.log('worker 1 received chemical @ ' + new Date().getTime())
  next(null, { worker: 1 })
  return true // this will prevent any follow up handlers to be executed matching given chemical
})

plasma.on('test-chemical', function (c, next) {
  console.log('worker 2 received chemical @ ' + new Date().getTime())
  next(null, { worker: 2 })
  return true
})

plasma.on('test-chemical', function (c, next) {
  console.log('worker 3 received chemical @ ' + new Date().getTime())
  next(null, { worker: 3 })
  return true
})

var testChemical = {
  type: 'test-chemical',
  data: {
    test: true
  }
}

async.timesSeries(3, function (n, next) {
  console.log('--------------')
  console.log('emmiting run ' + n)
  plasma.emit(testChemical, function (err, result) {
    // note that the feedback is received only from worker 1
    // also the listeners are hit in the order they were registered
    if (err) console.log(err)
    console.log('received feedback', JSON.stringify(result))
    next()
  })
})
