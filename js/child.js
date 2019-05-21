import Client from './PostRCPClient'
import ZnSize from './ZnSize'

const client = new Client('http://localhost:1234')
const sizer = new ZnSize(client)
client.logging(true)
client.start()
let dimensions = {'height': '100px', 'width': '300px'}
client.call('resize', {dimensions}, null, Infinity)

document.getElementById('toggleBoxSize').addEventListener('click', function(e) {
    let target = document.getElementById('target-box')
    if (target.style.height != '300px') {
        target.style.height = '300px'
        target.style.width = '500px'
    } else {
        target.style.height = '50px'
        target.style.width = '50px'
    }
    e.preventDefault()
})

document.getElementById('updatePageSize').addEventListener('click', function(e) {
    sizer.setSize()
})
