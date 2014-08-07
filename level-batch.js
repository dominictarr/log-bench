var random = require('./random')
var level = require('level')
var path = require('path')

var rimraf = require('rimraf')

var dbdir = path.join(__dirname, 'db')

rimraf.sync(dbdir)

var db = level(dbdir, {
  compression: false
})

var c = 0, start = Date.now(), l = 0

var b = []

var onDrain = require('./pummel')( 1024*1024, function () {
  var r = random()
  l += r.length
  if(b.length < 100) {
    b.push({key:c++, value:r, type: 'put'})
    return true
  }

  var _b = b
  b = []
  db.batch(_b, function (err) {
    if(err) throw err
    if(!(c % 5000))
      process.stdout.write(
        //mega bytes written per second
        ((l / ((Date.now() - start)/1000) / 1000000))
        + '\n'
      )

    if(onDrain) onDrain()
  })
  return false

})

