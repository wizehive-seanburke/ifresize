import Server from './PostRCPServer'
const server = new Server(window.location.origin)
server.logging(true)
server.register('resize', [['dimensions', 'Object']], 'Object', resizeHandler, 'Resize iframe to child-specified dimensions')

window.onresize = function (e) {
  server.publish('dimensions', { width: e.target.innerWidth + 'px', height: e.target.innerHeight + 'px' })
}

function resizeHandler (dimensions) {
  let target = document.getElementById('target')
  target.style.width = dimensions.width
  target.style.height = dimensions.height
}

server.start()
