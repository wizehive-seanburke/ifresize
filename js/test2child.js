import Client from './PostRCPClient'
import ZnSize from './ZnSize'

const client = new Client(window.location.origin)
let sizer = new ZnSize(client)
window.sizer = sizer


client.logging(true)
client.start()

client.subscribe('changeMethod', (methods) => {
    sizer.isAutoEnabled() ? sizer.autoSize() : null
    sizer = null
    sizer = new ZnSize(client, methods)
    sizer.autoSize()
})

sizer.autoSize()

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const changeBoxDim = (height, width) => {
    console.log({'height': height, 'width': width})
    let box = document.getElementById('box')
    console.log(box)
    box.style.height = `${height}px`
    box.style.width = `${width}px`
}

let boxSizeChanged = false;

setInterval(() => {
    boxSizeChanged ? changeBoxDim(50, 50) : changeBoxDim(getRandom(100, 300), getRandom(300, 800))
    boxSizeChanged = !boxSizeChanged
}, 5000)
