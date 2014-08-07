var random = require('./random')
var level = require('level')
var path = require('path')
var rimraf = require('rimraf')
var dbdir = path.join(__dirname, 'db')

rimraf.sync(dbdir)

var db = level(path.join(__dirname, 'db'),
  {keyEncoding: 'ascii', valueEncoding: 'ascii'})

var n = 0, m = 100, c = 0, start = Date.now(), l = 0

var onDrain = require('./pummel')( 1024*1024, function () {
  n++
  var r = random()
  l += r.length
  db.put(''+(c ++), r, function (err) {
    if(err) throw err
    n--
    if(!(c % 5000))
      process.stdout.write(
        //mega bytes written per second
        ((l / ((Date.now() - start)/1000) / 1000000))
        + '\n'
      )
    if(n < m) onDrain()
  })

  return n < m
})

