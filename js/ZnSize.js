//TODO: Check into using Mutation​Observer, example: https://github.com/davidjbradshaw/iframe-resizer

const getHeight = () => {
    // const document = window.document;
    // const bodyTop = Math.max(document.body.offsetTop, 0);
    // const documentTop = Math.max(document.documentElement.offsetTop, 0);
    // const bodyScroll = document.body.scrollHeight + bodyTop;
    // const bodyOffset = document.body.offsetHeight + bodyTop;
    // const documentScroll = document.documentElement.scrollHeight + documentTop;
    // const documentOffset = document.documentElement.offsetHeight + documentTop;
    // return Math.max(bodyScroll, bodyOffset, documentScroll, documentOffset);
    return heightCalc.bodyOffset();
}

const getWidth = () => {
    const document = window.document;
    const bodyLeft = Math.max(document.body.offsetLeft, 0);
    const documentLeft = Math.max(document.documentElement.offsetLeft, 0);
    const bodyScroll = document.body.scrollWidth + bodyLeft;
    const bodyOffset = document.body.offsetWidth + bodyLeft;
    const documentScroll = document.documentElement.scrollWidth + documentLeft;
    const documentOffset = document.documentElement.offsetWidth + documentLeft;
    return Math.max(bodyScroll, bodyOffset, documentScroll, documentOffset);
}

//From: https://github.com/davidjbradshaw/iframe-resizer/blob/772f24df77444aff5e6520ce31bf93111c70f0b3/js/iframeResizer.contentWindow.js#L853
const getComputedStyle = (prop, el) => {
    let value = 0
    el = el || document.body
    value = document.defaultView.getComputedStyle(el, null)
    value = null !== value ? value[prop] : 0
    return parseInt(value, 10)
}

const getMaxElement = (side, elements) => {
    let elementsLength = elements.length,
        elVal = 0,
        maxVal = 0,
        Side = capitalizeFirstLetter(side),
        timer = Date.now || function() { return new Date().getTime() }
    for (let i = 0; i < elementsLength; i++) {
        elVal = elements[i].getBoundingClientRect()[side] + getComputedStyle('margin' + Side, elements[i])
        console.log({'element': elements[i], 'val': elVal})
        if (elVal > maxVal) {
            console.log({'elVal': elVal, 'maxVal': maxVal})
            maxVal = elVal
        }
    }
    return maxVal
}

const heightCalc = {
    bodyOffset: () => {
        return document.body.offsetHeight + getComputedStyle('marginTop') + getComputedStyle('marginBottom')
    },
    bodyScroll: () => {
        return document.body.scrollHeight
    },
    documentElementOffset: () => {
        return document.documentElement.offsetHeight
    },
    documentElementScroll: () => {
        return document.documentElement.scrollHeight
    },
    lowestElement: () => {
        return Math.max(heightCalc.bodyOffset() || heightCalc.documentElementOffset(), getMaxElement('bottom', getAllElements()))
    },
    min: () => {
        return Math.min.apply(null, getAllMeasurements(heightCalc))
    }
}

const getAllMeasurements = (dimension) => {
    return [
        dimension.bodyOffset(),
        dimension.bodyScroll(),
        dimension.documentElementOffset(),
        dimension.documentElementScroll()
    ]
}

const getAllElements = () => {
    return document.querySelectorAll('body *')
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
};

class ZnSize {
    constructor(client) {
        this.client = client;
        this.timer = null;
    }
    setSize(dimensions) {
        console.log('In setSize');
        if (typeof dimensions === 'undefined') {
            dimensions = {};
        }
        if (!dimensions.height) {
            dimensions.height = getHeight() + 'px';
        }
        if (!dimensions.width) {
            dimensions.width =  getWidth() + 'px';
        }
        console.log(dimensions);
        this.client.call('resize', {dimensions}, null, Infinity);
    }
    autoSize(timeout) {
        console.log('In autosize');
        typeof timeout === 'number' || typeof timeout === 'undefined' || timeout
            ? this.timer = setInterval(() => {
                this.setSize()
            }, timeout)
            : clearTimeout(this.timer);
    }
    getWidth() {
        return getWidth()
    }
    getHeight() {
        return getHeight()
    }
}

export default ZnSize;
