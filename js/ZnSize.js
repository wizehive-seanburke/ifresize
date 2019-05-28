// Based on: https://github.com/davidjbradshaw/iframe-resizer
// Goal is to make a simple resize system

/**
 * Get the int value of a property for an element
 * @param prop
 * @param element
 * @returns {number}
 */
const getComputedStyle = (prop, element) => {
  let value = 0
  element = element || document.body
  value = document.defaultView.getComputedStyle(element, null)
  value = value !== null ? value[prop] : 0
  return parseInt(value, 10)
}

/**
 * Get the largest element based on the target page side & given elements
 * @param side
 * @param elements
 * @returns {number}
 */
const getMaxElement = (side, elements) => {
  let elementsLength = elements.length

  let elVal = 0

  let maxVal = 0

  let Side = capitalizeFirstLetter(side)
  for (let i = 0; i < elementsLength; i++) {
    elVal = elements[i].getBoundingClientRect()[side] + getComputedStyle(`margin${Side}`, elements[i])
    console.log({ 'element': elements[i], 'val': elVal })
    if (elVal > maxVal) {
      console.log({ 'elVal': elVal, 'maxVal': maxVal })
      maxVal = elVal
    }
  }
  return maxVal
}

const heightCalc = {
  /**
     * Get the body.offsetHeight
     * @returns {number}
     */
  bodyOffset: () => {
    return document.body.offsetHeight + getComputedStyle('marginTop') + getComputedStyle('marginBottom')
  },
  /**
     * Get the body.scrollHeight
     * @returns {number}
     */
  bodyScroll: () => {
    return document.body.scrollHeight
  },
  /**
     * Get the documentElement.offsetHeight
     * @returns {number}
     */
  documentElementOffset: () => {
    return document.documentElement.offsetHeight
  },
  /**
     * Get the documentElement.scrollHeight
     * @returns {number}
     */
  documentElementScroll: () => {
    return document.documentElement.scrollHeight
  },
  /**
     * Get the height of the element that's closest to the bottom of the page
     * @returns {number}
     */
  furthestElement: () => {
    return Math.max(heightCalc.bodyOffset() || heightCalc.documentElementOffset(), getMaxElement('bottom', getAllElements()))
  },
  /**
     * Get the min value of all the base measurements
     * @returns {number}
     */
  min: () => {
    return Math.min.apply(null, getAllMeasurements(heightCalc))
  },
  /**
     * Get the max value of all the base measurements
     * @returns {number}
     */
  max: () => {
    return Math.max.apply(null, getAllMeasurements(heightCalc))
  }
}

const widthCalc = {
  /**
     * Get the body.offsetWidth
     * @returns {number}
     */
  bodyOffset: () => {
    return document.body.offsetWidth
  },
  /**
     * Get the body.scrollWidth
     * @returns {number}
     */
  bodyScroll: () => {
    return document.body.scrollWidth
  },
  /**
     * Get the documentElement.offsetWidth
     * @returns {number}
     */
  documentElementOffset: () => {
    return document.documentElement.offsetWidth
  },
  /**
     * Get the documentElement.scrollWidth
     * @returns {number}
     */
  documentElementScroll: () => {
    return document.documentElement.scrollWidth
  },
  /**
     * Get the width of the element that's furthest to the right of the page
     * @returns {number}
     */
  furthestElement: () => {
    return Math.max(widthCalc.bodyOffset() || widthCalc.documentElementOffset(), getMaxElement('right', getAllElements()))
  },
  /**
     * Get the min value of all the base measurements
     * @returns {number}
     */
  min: () => {
    return Math.min.apply(null, getAllMeasurements(widthCalc))
  },
  /**
     * Get the max value of all the base measurements
     * @returns {number}
     */
  max: () => {
    return Math.max.apply(null, getAllMeasurements(widthCalc))
  },
  /**
     * Gets the max of body.scrollWidth & documentElement.scrollWidth
     * @returns {number}
     */
  scroll: () => {
    return Math.max(widthCalc.bodyScroll(), widthCalc.documentElementScroll())
  }
}

/**
 * Gets all the basic measurements from the dimension calculation object
 * @param dimCalc
 * @returns {(*|number)[]}
 */
const getAllMeasurements = (dimCalc) => {
  return [
    dimCalc.bodyOffset(),
    dimCalc.bodyScroll(),
    dimCalc.documentElementOffset(),
    dimCalc.documentElementScroll()
  ]
}

/**
 * Gets all the elements on the page
 * @returns {NodeListOf<Element>}
 */
const getAllElements = () => {
  return document.querySelectorAll('body *')
}

/**
 * Capitalizes the first letter of a string
 * @param string
 * @returns {string}
 */
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

class ZnSize {
  /**
     * @param client
     * @param methods
     */
  constructor (client, methods) {
    methods = typeof methods !== 'undefined' ? methods : {}
    this.client = client
    this.timer = null
    this.heightMethod = typeof methods.height === 'string' ? methods.height : 'bodyOffset'
    this.widthMethod = typeof methods.width === 'string' ? methods.width : 'scroll'
    this.observer = null
    this.auto = false
    this.currentWidth = 0
    this.currentHeight = 0
  }

  /**
     * Sets the page size automatically or uses the supplied dimensions
     * @param dimensions
     */
  setSize (dimensions) {
    const height = this.currentHeight
    const width = this.currentWidth
    this.currentHeight = this.getHeight()
    this.currentWidth = this.getWidth()
    console.log({
      'originalHeight': height,
      'newHeight': this.currentHeight,
      'heightTolerance': Math.abs(height - this.currentHeight),
      'sizeChanged': this.sizeChanged(height, this.currentHeight)
    })

    console.log({
      'originalWidth': width,
      'newWidth': this.currentWidth,
      'widthTolerance': Math.abs(width - this.currentWidth),
      'sizeChanged': this.sizeChanged(width, this.currentWidth)
    })

    if (typeof dimensions === 'undefined') {
      dimensions = {}
    }
    if (!dimensions.height) {
      dimensions.height = `${this.currentHeight}px`
    }
    if (!dimensions.width) {
      dimensions.width = `${this.currentWidth}px`
    }
    console.log(dimensions)
    this.client.call('resize', { dimensions }, null, Infinity)
  }

  /**
     * Toggle the autosize feature, if timeout is a int value it will default to using setInterval instead of MutationObserver
     * @param timeout
     * @returns {null}
     */
  autoSize (timeout) {
    // timeout = typeof timeout === "undefined" ? 100 : timeout //Currently override MutationObserver due to some buggy width detection
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
        this.observer = false
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

  /**
     * Get the page width
     * @param method
     * @returns {number}
     */
  getWidth (method) {
    method = typeof method === 'undefined' ? this.widthMethod : method
    console.log(method)
    return widthCalc[method]()
  }

  /**
     * Get the page height
     * @param method
     * @returns {number}
     */
  getHeight (method) {
    method = typeof method === 'undefined' ? this.heightMethod : method
    console.log(method)
    return heightCalc[method]()
  }

  /**
     * Is auto resize enabled
     * @returns {boolean}
     */
  isAutoEnabled () {
    return this.auto
  }

  /**
     * Sets up MutationObserver
     * @returns {MutationObserver}
     */
  setupMutation () {
    let MutationClass = window.MutationObserver || window.WebKitMutationObserver
    let observer = new MutationClass((mutations, observer) => {
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

  /**
     * Check if a size has changed
     * @param originalValue
     * @param newValue
     * @returns {boolean}
     */
  sizeChanged (originalValue, newValue, tolerance) {
    tolerance = typeof tolerance === 'number' ? tolerance : 0
    return !Math.abs(originalValue - newValue) <= tolerance
  }
}

export default ZnSize
