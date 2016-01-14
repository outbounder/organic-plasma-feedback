var exec = require('child_process').exec
var child = exec('node ./benchmarks/plasma-v0.0.x/test.js')
child.stdout.pipe(process.stdout)
var child2 = exec('node ./benchmarks/plasma-v1.x.x/test.js')
child2.stdout.pipe(process.stdout)
