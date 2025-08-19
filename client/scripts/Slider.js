class Slider {
  selectors = {
    root: "[data-js-catalog]",
    minNumber: "[data-js-number-min]",
    maxNumber: "[data-js-number-max]",
    minRange: "[data-js-range-min]",
    maxRange: "[data-js-range-max]",
    slider: "[data-js-slider]",
    progress: "[data-js-progress]",
  }

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root)
    this.minNumberElement = this.rootElement.querySelector(
      this.selectors.minNumber,
    )
    this.maxNumberElement = this.rootElement.querySelector(
      this.selectors.maxNumber,
    )
    this.minRangeElement = this.rootElement.querySelector(
      this.selectors.minRange,
    )
    this.maxRangeElement = this.rootElement.querySelector(
      this.selectors.maxRange,
    )
    this.sliderElement = this.rootElement.querySelector(this.selectors.slider)
    this.progressElement = this.rootElement.querySelector(
      this.selectors.progress,
    )

    this.MaxInput = this.MaxInput.bind(this)
    this.MinInput = this.MinInput.bind(this)
    this.RangeInput = this.RangeInput.bind(this)

    this.initEvents()
    this.UpdateProgress()
  }

  initEvents() {
    this.minRangeElement.addEventListener("input", this.RangeInput)
    this.maxRangeElement.addEventListener("input", this.RangeInput)

    this.minNumberElement.addEventListener("input", this.MinInput)
    this.maxNumberElement.addEventListener("input", this.MaxInput)
  }

  RangeInput(event) {
    const input = event.target
    const minVal = parseInt(this.minRangeElement.value)
    const maxVal = parseInt(this.maxRangeElement.value)

    if (input === this.minRangeElement && minVal > maxVal) {
      this.minRangeElement.value = maxVal
    }

    if (input === this.maxRangeElement && maxVal < minVal) {
      this.maxRangeElement.value = minVal
    }

    this.UpdateProgress()
  }

  MinInput() {
    const minVal = parseInt(this.minNumberElement.value)
    const maxVal = parseInt(this.maxRangeElement.value)

    if (minVal > maxVal) {
      this.minNumberElement.value = maxVal
    }

    this.minRangeElement.value = this.minNumberElement.value
    this.UpdateProgress()
  }

  MaxInput() {
    const minVal = parseInt(this.minRangeElement.value)
    const maxVal = parseInt(this.maxNumberElement.value)

    if (maxVal < minVal) {
      this.maxNumberElement.value = minVal
    }

    this.maxRangeElement.value = this.maxNumberElement.value
    this.UpdateProgress()
  }

  UpdateProgress() {
    const maxRangeElement = parseInt(this.maxRangeElement.value)
    const minRangeElement = parseInt(this.minRangeElement.value)
    const min = parseInt(this.minRangeElement.min)
    const max = parseInt(this.maxRangeElement.max)

    const range = maxRangeElement - minRangeElement
    const totalWidth = max - min

    const width = (range / totalWidth) * 100
    const offset = ((minRangeElement - min) / totalWidth) * 100

    this.progressElement.style.width = width + "%"
    this.progressElement.style.left = offset + "%"
    this.progressElement.style.backgroundColor = "#444B58"

    this.minNumberElement.value = minRangeElement
    this.maxNumberElement.value = maxRangeElement
  }
}

export default Slider
