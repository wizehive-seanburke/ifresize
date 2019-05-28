import iframeResizerContentWindow from 'iframe-resizer'

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

setTimeout(() => {
    console.log('in interval')
    boxSizeChanged ? changeBoxDim(50, 50) : changeBoxDim(getRandom(100, 300), getRandom(300, 800))
    boxSizeChanged = !boxSizeChanged
}, 1000)


