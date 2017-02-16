var Plasma = require('organic-plasma')
var plasma = require('../index')(new Plasma())

plasma.on('test-chemical', function (c, next) {
  console.log('reacted on ' + JSON.stringify(c))
  next(new Error('test error'))
})

var testChemical = {
  type: 'test-chemical',
  data: {
    test: true
  }
}

console.log('emmiting ' + JSON.stringify(testChemical))
plasma.emit(testChemical, function (err, result) {
  console.log('received feedback error', JSON.stringify(err.message))
  console.log('received feedback result', JSON.stringify(result))
})
