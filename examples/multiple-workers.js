var Plasma = require("organic-plasma")
var plasma  = require("../index")(new Plasma())

for (var i = 1; i<=3; i++) {
  plasma.on("test-chemical", function (c, next) {
    console.log("worker" + i + "received" + JSON.stringify(c))
    next(null, { worker: i })
  })
}

var testChemical = {
  type: "test-chemical",
  data: {
    test: true
  }
}

for (var f = 1; f<=10; f++) {
  console.log("emmiting " + JSON.stringify(testChemical) + " run " + f)
  plasma.emit(testChemical, function(err, result) {
    console.log("received feedback", JSON.stringify(result))
  })
}

