var Plasma = require('organic-plasma')
var plasma = require('../index')(new Plasma())

plasma.on('test-chemical', function (c, next) {
  console.log('reacted on ' + JSON.stringify(c))
  next(null, { success: true })
})

var testChemical = {
  type: 'test-chemical',
  data: {
    test: true
  }
}

console.log('emmiting ' + JSON.stringify(testChemical))
plasma.emit(testChemical, function (err, result) {
  if (err) console.error(err)
  console.log('received feedback', JSON.stringify(result))
})
