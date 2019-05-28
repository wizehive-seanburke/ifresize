import Server from './PostRCPServer'
const server = new Server(window.location.href)
server.logging(true)
server.register('resize', [['dimensions', 'Object']], 'Object', resizeHandler, 'Resize iframe to child-specified dimensions')

function resizeHandler (dimensions) {
  let target = document.getElementById('target')
  target.style.width = dimensions.width
  target.style.height = dimensions.height
}
server.start()
