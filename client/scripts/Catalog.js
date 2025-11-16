import {
  getBucketLocalStorage,
  setBucketLocalStorage,
  showErrorMessage,
} from "./utils.js"
import {
  ERROR_SERVER,
  VISIBLE_CARDS,
  NO_PRODUCTS_IN_THIS_CATEGORY,
  PRODUCT_INFORMATION_NOT_FOUND,
} from "./constants.js"

class Catalog {
  selectors = {
    grid: "[data-js-catalog-grid]",
    button: "[data-js-catalog-showMore]",
    url: "/api",
  }

  constructor() {
    this.container = null
    this.buttonShowMore = null
    this.urlApi = this.selectors.url
    this.products = []
    this.currentCards = VISIBLE_CARDS
    this.currentPage = 1
    this.modalBody = null
    this.init()
  }

  init() {
    this.container = document.querySelector(this.selectors.grid)
    this.buttonShowMore = document.querySelector(this.selectors.button)
    this.modalBody = document.querySelector("[data-js-modal-body]")

    if (!this.container) {
      console.error('Catalog container not found')
      return
    }

    this.getProducts()
    this.addEventListeners()
  }

  addEventListeners() {
    if (this.buttonShowMore) {
      this.buttonShowMore.addEventListener("click", () => this.showMoreCards())
    }

    if (this.container) {
      this.container.addEventListener("click", (event) => {
        this.addToBucket(event)
        this.showProductModal(event)
      })
    }

    document.addEventListener("basketItemRemoved", () => {
      const bucket = getBucketLocalStorage()
      this.checkingActiveButtons(bucket)
    })

    const heroButton = document.querySelector(".hero-button")
    if (heroButton) {
      heroButton.addEventListener("click", () => {
        const catalog = document.getElementById("catalog")
        if (catalog) {
          catalog.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    }
  }

  showMoreCards() {
    if (!this.buttonShowMore || !this.container) return

    if (this.currentCards >= this.products.length) {
      return
    }

    this.currentPage++
    const newCurrentCards = this.currentCards * this.currentPage

    const productItem = this.products.slice(this.currentCards, newCurrentCards)
    this.renderCard(productItem)

    this.currentCards = this.container.children.length

    if (this.currentCards >= this.products.length) {
      this.buttonShowMore.classList.add("visually-hidden")
    } else {
      this.buttonShowMore.classList.remove("hidden")
    }
  }

  addToBucket(event) {
    event.preventDefault()
    event.stopPropagation()
    const targetButton = event.target.closest("[data-js-card-button-bucket]")
    if (!targetButton) {
      return
    }
    const card = targetButton.closest(".catalog__main-card")
    const id = card.dataset.jsCardId

    const bucket = getBucketLocalStorage()

    if (bucket.includes(id)) {
      return
    }

    bucket.push(id)
    setBucketLocalStorage(bucket)
    this.checkingActiveButtons(bucket)
    document.dispatchEvent(new CustomEvent("basketUpdated"))
  }

  addToBucketFromModal(event) {
    event.preventDefault()
    event.stopPropagation()

    const targetButton = event.target.closest("[data-js-modal-add-bucket]")
    if (!targetButton) {
      return
    }

    const productId = targetButton.dataset.productId

    const bucket = getBucketLocalStorage()

    if (bucket.includes(productId)) {
      return
    }

    bucket.push(productId)
    setBucketLocalStorage(bucket)

    this.checkingActiveButtons(bucket)

    this.updateModalButton(targetButton, true)

    document.dispatchEvent(new CustomEvent("basketUpdated"))
  }

  updateModalButton(button, inBucket) {
    button.disabled = inBucket
    if (inBucket) {
      button.textContent = "В корзине"
      button.classList.add("active")
    } else {
      button.textContent = "Заказать"
      button.classList.remove("active")
    }
  }

  checkingActiveButtons(bucket) {
    const buttons = document.querySelectorAll("[data-js-card-button-bucket]")
    buttons.forEach((button) => {
      const card = button.closest(".catalog__main-card")
      const id = card.dataset.jsCardId
      const inBucket = bucket.includes(id)

      button.disabled = inBucket
      button.classList.toggle("active", inBucket)
    })
  }

  showProductModal(event) {
    event.preventDefault()
    const targetButton = event.target.closest("[data-js-card-button-look]")
    if (!targetButton) {
      return
    }
    const card = targetButton.closest(".catalog__main-card")
    const id = Number(card.dataset.jsCardId)
    const product = this.products.find((item) => item.id === id)
    if (!product) {
      showErrorMessage(PRODUCT_INFORMATION_NOT_FOUND)
      return
    }

    this.renderModal(product)
    this.showModal()
  }

  renderModal(product) {
    if (!this.modalBody) return

    this.modalBody.innerHTML = ""
    const { id, title, description, image, price, size, gender } = product

    const bucket = getBucketLocalStorage()
    const inBucket = bucket.includes(id.toString())
    const buttonText = inBucket ? "В корзине" : "Заказать"
    const buttonClass = inBucket
      ? "modal__body-button button active"
      : "modal__body-button button"
    const buttonDisabled = inBucket ? "disabled" : ""

    const productItem = `
                <div class="modal__body-left">
                    <img src="../icons/${image}" alt="${title}" height="520" width="462">
                    <h3 class="modal__body-titleDescription">Описание</h3>
                    <div class="modal__body-description">${description}</div>
                </div>
                <div class="modal__body-right">
                     <div class="modal__body-pretitle">
                        <p class="modal__body-article">Артикул: ${id}</p>
                        <p class="modal__body-quantity">В наличии: 13 шт</p>
                    </div>
                    <h2 class="modal__body-title">${title}</h2>
                    <div class="modal__body-table">
                        <p class="modal__body-subtitle">Выберите размер</p>
                        <div class="modal__body-table-grid">
                            <div class="modal__body-table-size">39</div>
                            <div class="modal__body-table-size">40</div>
                            <div class="modal__body-table-size">41</div>
                            <div class="modal__body-table-size">42</div>
                            <div class="modal__body-table-size">43</div>
                        </div>
                    </div>
                    <p class="modal__body-price">${price} ₽</p>
                    <button class="${buttonClass}" data-js-modal-add-bucket data-product-id="${id}" ${buttonDisabled}>${buttonText}</button>
                    <h3 class="modal__body-titleCharacteristic">Характеристики</h3>
                    <div class="modal__body-characteristic">
                        <ul class="modal__body-list">
                            <li class="modal__body-link">
                                <p class="modal__body-item">Пол: ${gender}</p>
                            </li>
                            <li class="modal__body-link">
                                <p class="modal__body-item">Размер: ${size}</p>
                            </li>
                            <li class="modal__body-link">
                                <p class="modal__body-item">Цвета: Разноцветный</p>
                            </li>
                            <li class="modal__body-link">
                                <p class="modal__body-item">Состав: Кожа, текстиль, резина</p>
                            </li>
                            <li class="modal__body-link">
                                <p class="modal__body-item">Страна: Вьетнам</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="modal__body-video">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/DS5VUoUO4f8?si=h426uavwH8Gx4lLE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            `
    this.modalBody.innerHTML = productItem
  }

  showModal() {
    const modal = document.querySelector("[data-js-modal]")
    if (modal) {
      modal.classList.add("active")
      this.addModalListeners()
    } else {
      console.error("Modal element not found!")
    }
  }

  addModalListeners() {
    document.querySelectorAll("[data-js-modal-close]").forEach((button) => {
      button.addEventListener("click", () => this.closeModal())
    })

    if (this.modalBody) {
      this.modalBody.addEventListener("click", (event) => {
        this.addToBucketFromModal(event)
      })
    }

    document.addEventListener("keydown", this.handleEscapePress)
  }

  closeModal() {
    document.documentElement.classList.remove("modal-open")
    document.body.classList.remove("modal-open")
    const modal = document.querySelector("[data-js-modal]")
    if (modal) {
      modal.classList.remove("active")
      this.removeModalListeners()
      if (this.modalBody) {
        this.modalBody.innerHTML = ""
      }
    }
  }

  removeModalListeners() {
    document.removeEventListener("keydown", this.handleEscapePress)
    if (this.modalBody) {
      this.modalBody.removeEventListener("click", this.addToBucketFromModal)
    }
  }

  handleEscapePress = (e) => {
    if (e.key === "Escape") {
      this.closeModal()
    }
  }

  async getProducts() {
    try {
      if (!this.products.length) {
        const res = await fetch(`${this.urlApi}`)

        if (!res.ok) {
          throw new Error(res.statusText)
        }

        this.products = await res.json()

        if (this.buttonShowMore) {
          if (this.products.length > VISIBLE_CARDS) {
            this.buttonShowMore.classList.remove("hidden")
          } else {
            this.buttonShowMore.classList.add("hidden")
          }
        }

        this.renderProducts(this.products)
      }
    } catch (err) {
      showErrorMessage(ERROR_SERVER)
      console.log(err.message)
    }
  }

  renderProducts(data) {
    if (!data || !data.length) {
      showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY)
      return
    }

    const arrCards = data.slice(0, VISIBLE_CARDS)
    this.renderCard(arrCards)
  }

  renderCard(data) {
    if (!this.container) return

    data.forEach((card) => {
      const { id, title, image, price } = card
      const cardItem = `
                    <div class="catalog__main-card" data-js-card-id="${id}">
                        <a href="/" class="catalog__main-image">
                            <img src="../icons/${image}" alt="${title}" height="293" width="280">
                            <div class="catalog__main-overlay" data-js-card-overlay>
                                <button class="catalog__main-overlay-button" type="button" aria-label="Взглянуть на товар" data-js-card-button-look>
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="catalog__main-overlay-svg-1">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9518 15.0664C18.9518 17.2489 17.1818 19.0176 14.9993 19.0176C12.8168 19.0176 11.0481 15.0664 11.0481 15.0664C11.0481 12.8826 12.8168 11.1139 14.9993 11.1139C17.1818 11.1139 18.9518 12.8826 18.9518 15.0664Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
}

export default Catalog