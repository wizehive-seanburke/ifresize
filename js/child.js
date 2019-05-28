import Client from './PostRCPClient'
import ZnSize from './ZnSize'
import '../css/flexbox.css'

const client = new Client(window.location.href)
const sizer = new ZnSize(client)
window.sizer = sizer
client.logging(true)
client.start()
let dimensions = {'height': '100px', 'width': '300px'}
client.call('resize', {dimensions}, null, Infinity)

document.getElementById('toggleBoxSize').addEventListener('click', (e) => {
    let target = document.getElementById('targetBox')
    if (target.style.height != '300px') {
        target.style.height = '300px'
        target.style.width = '500px'
    } else {
        target.style.height = '50px'
        target.style.width = '50px'
    }
})

document.getElementById('updatePageSize').addEventListener('click', (e) => {
    sizer.setSize()
})

document.getElementById('autoToggle').addEventListener('click', () => {
    let span = document.getElementById('autosizeStatus')
    span.innerHTML = sizer.isAutoEnabled() ? 'Off' : 'On'
    sizer.autoSize()
})

document.addEventListener('DOMContentLoaded', () => {
    sizer.autoSize()
})

document.getElementById('manual').addEventListener('submit', (e) => {
    let height = e.target.height.value + 'px'
    let width = e.target.width.value + 'px'
    if (sizer.isAutoEnabled()) {
        sizer.autoSize()
        let span = document.getElementById("autosizeStatus")
        span.innerHTML = "Off"
    }
    sizer.setSize({"height": height, "width": width})
    e.preventDefault()
})

document.getElementById("boxSize").addEventListener("submit", (e) => {
    let height = e.target.height.value + 'px'
    let width = e.target.width.value + 'px'
    let box = document.getElementById("targetBox")
    box.style.width = width
    box.style.height = height
    e.preventDefault()
})
