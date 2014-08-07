
module.exports = function (l, write) {

  function dump() {
    while(l --> 0)
      if(!write()) return
  }

  dump()

  return dump
}
