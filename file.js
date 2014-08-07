

var fs = require('fs')
var path = require('path')

var random = require('./random')
var pummel = require('./pummel')

var filename = path.join(__dirname, 'file.ldjson')

//this is really fast! 500 mb a second!
//filename = '/dev/null'
var stream = fs.createWriteStream(filename)

var l = 0, c = 0, start = Date.now()
var b = ''
var onDrain = pummel(1024*1024, function () {
  var r = random() + '\n'
  l += r.length
  c++
  if(!(c % 5000))
    process.stdout.write(
      //mega bytes written per second
      ((l / ((Date.now() - start)/1000) / 1000000))
      + '\n'
    )

  if(b.length < 1024*30) {
    b += r
    return true
  }

  var _b = b
  b = ''
  return stream.write(_b)
})

stream.on('drain', onDrain)
