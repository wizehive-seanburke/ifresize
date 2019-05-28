//TODO: Check into using Mutation​Observer, example: https://github.com/davidjbradshaw/iframe-resizer
//From: https://github.com/davidjbradshaw/iframe-resizer/blob/772f24df77444aff5e6520ce31bf93111c70f0b3/js/iframeResizer.contentWindow.js#L853
const getComputedStyle = (prop, element) => {
    let value = 0
    element = element || document.body
    value = document.defaultView.getComputedStyle(element, null)
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
    furthestElement: () => {
        return Math.max(heightCalc.bodyOffset() || heightCalc.documentElementOffset(), getMaxElement('bottom', getAllElements()))
    },
    min: () => {
        return Math.min.apply(null, getAllMeasurements(heightCalc))
    },
    max: () => {
        return Math.max.apply(null, getAllMeasurements(heightCalc))
    }
}

const widthCalc = {
    bodyOffset: () => {
        return document.body.scrollWidth
    },
    bodyScroll: () => {
        return document.body.scrollWidth
    },
    documentElementOffset: () => {
        return document.documentElement.offsetWidth
    },
    documentElementScroll: () => {
        return document.documentElement.scrollWidth
    },
    furthestElement: () => {
        return Math.max(widthCalc.bodyOffset() || widthCalc.documentElementOffset(), getMaxElement('right', getAllElements()))
    },
    min: () => {
        return Math.min.apply(null, getAllMeasurements(widthCalc))
    },
    max: () => {
        return Math.max.apply(null, getAllMeasurements(widthCalc))
    }
}

const getAllMeasurements = (dimCalc) => {
    return [
        dimCalc.bodyOffset(),
        dimCalc.bodyScroll(),
        dimCalc.documentElementOffset(),
        dimCalc.documentElementScroll()
    ]
}

const getAllElements = () => {
    return document.querySelectorAll('body *')
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
};

class ZnSize {
    constructor(client, method) {
        this.client = client
        this.timer = null
        this.method = typeof method === 'string' ? method : 'bodyOffset'
        this.observer = null
        this.auto = false
    }
    setSize(dimensions) {
        console.log('In setSize');
        if (typeof dimensions === 'undefined') {
            dimensions = {};
        }
        if (!dimensions.height) {
            dimensions.height = this.getHeight() + 'px'
        }
        if (!dimensions.width) {
            dimensions.width =  this.getWidth() + 'px'
        }
        console.log(dimensions);
        this.client.call('resize', {dimensions}, null, Infinity)
    }
    autoSize(timeout) {
        console.log ('autoSize');
        console.log({'timeout': timeout})
        if (this.auto) {
            this.auto = false
            if (this.observer === null) {
                if (this.timer === null) {
                    return null
                } else {
                    clearInterval(this.timer)
                    this.timer = null
                }
            } else {
                this.observer.disconnect()
                this.observer = false;
            }
            return null
        }
        this.setSize()
        typeof timeout === 'number'
            ? this.timer = setInterval(() => {
                this.setSize()
            }, timeout)
            : this.observer = this.setupMutation()
        this.auto = true
    }
    getWidth() {
        console.log(this.method)
        return widthCalc[this.method]()
    }
    getHeight() {
        return heightCalc[this.method]()
    }
    isAutoEnabled() {
        return this.auto
    }
    setupMutation() {
        let mutationClass = window.MutationObserver || window.WebKitMutationObserver
        let observer = new mutationClass((mutations, observer) => {
            this.setSize()
        })
        observer.observe(document.querySelector('body'), {
            attributes: true,
            attributeOldValue: false,
            characterData: true,
            characterDataOldValue: false,
            childList: true,
            subtree: true
        })
        return observer
    }
}

export default ZnSize
