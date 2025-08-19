import { showErrorMessage } from "./utils.js"
import { ERROR_SERVER, NO_ITEMS_CART } from "./constants.js"

class CatalogFilter {
  constructor() {
    this.overlayElement = document.querySelector("[data-js-catalog-overlay]")
    this.mainButton = document.querySelector("[data-js-catalog-button]")

    this.acceptButton = document.querySelector("[data-js-filter-buttonAccept]")
    this.resetButton = document.querySelector("[data-js-filter-buttonReset]")

    this.sizeArray = Array.from(
      document.querySelectorAll("[data-js-filter-size]"),
    )

    this.genderArray = Array.from(
      document.querySelectorAll("[data-js-filter-gender]"),
    )

    this.priceMin = document.querySelector("[data-js-number-min]")
    this.priceMax = document.querySelector("[data-js-number-max]")

    this.priceMinRange = document.querySelector("[data-js-range-min]")
    this.priceMaxRange = document.querySelector("[data-js-range-max]")
    this.progressElement = document.querySelector("[data-js-progress]")
    this.container = document.querySelector("[data-js-catalog-grid]")

    this.showMoreButton = document.querySelector("[data-js-catalog-showMore]")

    this.products = []
    this.urlApi = "/api"

    this.currentFiltres = {
      priceMin: null,
      priceMax: null,
      genders: [],
      sizes: [],
    }

    this.getProducts()
    this.init()
  }

  init() {
    this.mainButton.addEventListener("click", () => this.clickOnFilter())
    this.checkSizes(this.sizeArray)

    this.resetButton.addEventListener("click", () => this.clickOnReset())
    this.acceptButton.addEventListener("click", () => this.filterData())
  }

  clickOnReset() {
    this.priceMin.value = "0"
    this.priceMax.value = "25768"

    this.priceMinRange.value = "0"
    this.priceMaxRange.value = "25768"

    this.genderArray.forEach((checkbox) => (checkbox.checked = false))
    this.sizeArray.forEach((checkbox) => (checkbox.checked = false))

    this.currentFiltres = {
      priceMin: this.priceMin.value,
      priceMax: this.priceMax.value,
      genders: [],
      sizes: [],
    }

    this.sizeArray.forEach((size) => {
      size.classList.remove("is-active")
    })

    this.progressElement.style.width = "100%"
    this.progressElement.style.left = "0%"
    this.showMoreButton.classList.remove("visually-hidden")
    this.mainButton.classList.remove("is-active")
    this.overlayElement.classList.remove("is-active")

    this.renderCards(this.products)
  }

  filterData() {
    this.currentFiltres.priceMin = this.priceMin.value
    this.currentFiltres.priceMax = this.priceMax.value

    this.currentFiltres.genders = this.genderCheck(this.genderArray)
    if (this.currentFiltres.genders.length === 2) {
      this.currentFiltres.genders = "unisex"
    }

    this.currentFiltres.sizes = this.correctSizes()

    const filteredProducts = this.filterProducts(this.products)
    this.renderCards(filteredProducts)
    this.showMoreButton.classList.add("visually-hidden")
    this.mainButton.classList.remove("is-active")
    this.overlayElement.classList.remove("is-active")
  }

  filterProducts(products) {
    return products.filter((product) => {
      // 1. Фильтрация по цене
      const productPrice = parseFloat(product.price)
      const minPrice = parseFloat(this.currentFiltres.priceMin)
      const maxPrice = parseFloat(this.currentFiltres.priceMax)

      if (productPrice < minPrice || productPrice > maxPrice) {
        return false
      }

      // 2. Фильтрация по полу
      if (
        this.currentFiltres.genders &&
        this.currentFiltres.genders.length > 0
      ) {
        if (this.currentFiltres.genders !== "unisex") {
          const productGender = product.gender || ""
          if (!this.currentFiltres.genders.includes(productGender)) {
            return false
          }
        }
      }

      // 3. Фильтрация по размерам
      if (this.currentFiltres.sizes && this.currentFiltres.sizes.length > 0) {
        const productSize = product.size ? product.size.toString() : ""
        //для случая если будет в карточке несколько размеров одной модели
        const hasSize = this.currentFiltres.sizes.some((selectedSize) => {
          return productSize.includes(selectedSize)
        })

        if (!hasSize) {
          return false
        }
      }

      return true
    })
  }

  renderCards(data) {
    this.container.innerHTML = ""

    if (!data || data.length === 0) {
      showErrorMessage(NO_ITEMS_CART)
      return
    }

    data.forEach((card) => {
      const { id, title, image, price } = card
      const cardItem = `
                <div class="catalog__main-card" data-js-card-id="${id}">
                    <a href="/" class="catalog__main-image">
                        <img src="../icons/${image}" alt="${title}" height="293" width="280">
                        <div class="catalog__main-overlay" data-js-card-overlay>
                            <button class="catalog__main-overlay-button" type="button" aria-label="Взглянуть на товар" data-js-card-button-look>
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="catalog__main-overlay-svg-1">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9518 15.0664C18.9518 17.2489 17.1818 19.0176 14.9993 19.0176C12.8168 19.0176 11.0481 17.2489 11.0481 15.0664C11.0481 12.8826 12.8168 11.1139 14.9993 11.1139C17.1818 11.1139 18.9518 12.8826 18.9518 15.0664Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9975 24.1936C19.7575 24.1936 24.1112 20.7711 26.5625 15.0661C24.1112 9.3611 19.7575 5.9386 14.9975 5.9386H15.0025C10.2425 5.9386 5.88875 9.3611 3.4375 15.0661C5.88875 20.7711 10.2425 24.1936 15.0025 24.1936H14.9975Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="catalog__main-overlay-button" type="button" aria-label="Добавить в корзину" data-js-card-button-bucket>
                                <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="catalog__main-overlay-svg-2">
                                    <path d="M27.9999 9.28571H23.2454L18.2502 0.450683C18.0025 0.0118078 17.465 -0.131483 17.0497 0.132405C16.6353 0.396293 16.5011 0.966644 16.7498 1.40646L21.2046 9.28571H6.79543L11.2502 1.40639C11.4989 0.966581 11.3647 0.39623 10.9503 0.132342C10.5342 -0.131546 9.99842 0.0117453 9.74975 0.450621L4.75464 9.28565H0V11.1428H1.89911L4.12206 23.7266C4.35446 25.0442 5.43966 26 6.70265 26H21.2974C22.5603 26 23.6455 25.0442 23.8771 23.7275L26.1008 11.1428H28L27.9999 9.28571ZM22.1569 23.3857C22.08 23.8246 21.7186 24.1429 21.2973 24.1429H6.70265C6.28138 24.1429 5.91996 23.8246 5.84219 23.3848L3.67904 11.1428H24.321L22.1569 23.3857Z" fill="white"/>
                                </svg>
                            </button>
                        </div>
                    </a>
                    <a href="/" class="catalog__main-card-description">
                        <span class="catalog__main-title">${title}</span>
                        <span class="catalog__main-price">${price} ₽</span>
                    </a>
                </div>
            `
      this.container.insertAdjacentHTML("beforeend", cardItem)
    })
  }

  correctSizes() {
    return this.sizeArray
      .filter((element) => element.classList.contains("is-active"))
      .map((element) => element.textContent.trim())
  }

  genderCheck(data) {
    return data
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value)
  }

  async getProducts() {
    try {
      const res = await fetch(`${this.urlApi}`)
      if (!res.ok) {
        throw new Error(res.statusText)
      }

      this.products = await res.json()
    } catch (e) {
      showErrorMessage(ERROR_SERVER)
      console.log(e)
    }
  }

  checkSizes(data) {
    data.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("is-active")
      })
    })
  }

  clickOnFilter() {
    this.mainButton.classList.toggle("is-active")
    document.body.classList.toggle("is-lock")
    this.overlayElement.classList.toggle("is-active")
  }
}

export default CatalogFilter
