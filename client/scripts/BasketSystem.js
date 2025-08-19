import {
  checkBucketValue,
  getBucketLocalStorage,
  setBucketLocalStorage,
  showErrorMessage,
} from "./utils.js"
import { ERROR_SERVER, NO_ITEMS_CART } from "./constants.js"

class BasketSystem {
  constructor() {
    this.products = []
    this.urlApi = "/api"
    this.basketOverlay = document.querySelector("[data-js-basket-overlay]")
    this.basketContainer = document.querySelector("[data-js-basket]")
    this.basketItemsContainer = document.querySelector("[data-js-basket-items]")
    this.basketTotal = document.querySelector("[data-js-basket-total]")
    this.basketButton = document.querySelector("[data-js-header-bucket]")
    this.getProducts()
    this.init()
  }

  init() {
    this.basketButton.addEventListener("click", (e) => {
      e.preventDefault()
      this.openBasket()
    })

    this.basketOverlay.addEventListener("click", (e) => {
      if (e.target === this.basketOverlay) {
        this.closeBasket()
      }
    })

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.basketOverlay.classList.contains("active")
      ) {
        this.closeBasket()
      }
    })

    this.basketItemsContainer.addEventListener("click", (e) => {
      this.deleteProductBasket(e)
    })

    document.addEventListener("basketUpdated", () => {
      this.refresh()
      this.updateCatalogButtons()
    })

    // Обновление позиции при изменении размера окна
    window.addEventListener("resize", () => {
      if (this.basketOverlay.classList.contains("active")) {
        this.positionBasket()
      }
    })

    // Обновление позиции при скролле
    window.addEventListener("scroll", () => {
      if (this.basketOverlay.classList.contains("active")) {
        this.positionBasket()
      }
    })
  }

  updateBasketButton() {
    const bucket = getBucketLocalStorage()
    const hasItems = bucket && bucket.length > 0
    const button = document.querySelector(".basket__order-button")

    if (button) {
      button.classList.toggle("active", hasItems)
      button.style.opacity = hasItems ? "1" : "0.5"
      button.style.pointerEvents = hasItems ? "auto" : "none"
    }
  }

  refresh() {
    if (this.products && this.products.length) {
      this.loadProductsBasket(this.products)
    }
    this.updateBasketButton()
  }

  updateCatalogButtons() {
    const bucket = getBucketLocalStorage()
    const buttons = document.querySelectorAll("[data-js-card-button-bucket]")

    buttons.forEach((button) => {
      const card = button.closest(".catalog__main-card")
      if (!card) {
        return
      }

      const id = card.dataset.jsCardId
      const inBucket = bucket.includes(id)

      button.disabled = inBucket
      button.classList.toggle("active", inBucket)
    })
  }

  positionBasket() {
    if (!this.basketButton || !this.basketContainer) {
      return
    }

    const buttonRect = this.basketButton.getBoundingClientRect()
    const basketWidth = 400 // Ширина корзины из CSS
    const spacing = 10 // Отступ от кнопки

    // Вычисляем позицию
    let top = buttonRect.bottom + spacing
    let right = window.innerWidth - buttonRect.right

    // Проверяем, не выходит ли корзина за пределы экрана справа
    if (right < 0) {
      right = spacing
    }

    // Проверяем, не выходит ли корзина за пределы экрана слева
    const leftPosition = window.innerWidth - right - basketWidth
    if (leftPosition < spacing) {
      right = window.innerWidth - basketWidth - spacing
    }

    // Проверяем, не выходит ли корзина за пределы экрана снизу
    const basketHeight = 400 // Максимальная высота корзины
    if (top + basketHeight > window.innerHeight) {
      // Показываем корзину сверху от кнопки
      top = buttonRect.top - basketHeight - spacing

      // Если и сверху не помещается, показываем в центре экрана
      if (top < spacing) {
        top = (window.innerHeight - basketHeight) / 2
      }
    }

    // Применяем позиционирование
    this.basketContainer.style.top = `${Math.max(spacing, top)}px`
    this.basketContainer.style.right = `${Math.max(spacing, right)}px`

    // Убираем left если он был установлен медиа-запросами
    if (window.innerWidth > 480) {
      this.basketContainer.style.left = "auto"
    }
  }

  openBasket() {
    this.basketOverlay.classList.add("active")
    // Устанавливаем позицию после добавления класса active
    requestAnimationFrame(() => {
      this.positionBasket()
    })
  }

  closeBasket() {
    this.basketOverlay.classList.remove("active")
  }

  async getProducts() {
    try {
      const res = await fetch(`${this.urlApi}`)
      if (!res.ok) {
        throw new Error(res.statusText)
      }

      this.products = await res.json()
      this.loadProductsBasket(this.products)
    } catch (e) {
      showErrorMessage(ERROR_SERVER)
      console.log(e)
    }
  }

  loadProductsBasket(data) {
    if (!data || !data.length) {
      showErrorMessage(NO_ITEMS_CART)
      return
    }
    checkBucketValue(data)
    const basket = getBucketLocalStorage()

    if (!basket || !basket.length) {
      this.renderEmptyBasket()
      return
    }

    const findProducts = data.filter((item) => basket.includes(String(item.id)))

    if (!findProducts.length) {
      showErrorMessage(NO_ITEMS_CART)
      return
    }

    this.renderProductsBasket(findProducts)
  }

  renderEmptyBasket() {
    this.basketItemsContainer.innerHTML = `
        <div class="basket__empty">
            <p>Корзина пуста</p>
            <p>Добавьте товары для оформления заказа</p>
        </div>
    `
    this.renderTotal(0)

    this.updateBasketButton()
  }

  renderProductsBasket(data) {
    if (!Array.isArray(data)) {
      console.error("Data should be an array")
      return
    }

    const basketItemsHtml = data
      .map((product) => {
        const { id, title, image, price } = product

        return `
                <div class="basket__item" data-product-id="${id}">  
                    <div class="basket__item-image">
                        <img src="../icons/${image}" alt="${title}" width="100" height="100" />
                    </div>
                    <div class="basket__item-info">
                        <h3 class="basket__item-title">${title}</h3>                   
                        <div class="basket__item-price">${price} ₽</div>
                    </div>
                    <button class="basket__item-remove" data-remove-id>
                        <svg id="Layer_1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m15 0h-6a3 3 0 0 0 -3 3v1h-4a1 1 0 0 0 0 2h1.054l.846 15.167a3 3 0 0 0 3 2.833h10.208a3 3 0 0 0 3-2.833l.838-15.167h1.054a1 1 0 0 0 0-2h-4v-1a3 3 0 0 0 -3-3zm-7 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1h-8zm10.106 18.056a1 1 0 0 1 -1 .944h-10.214a1 1 0 0 1 -1-.944l-.835-15.056h13.886z"/><path d="m12 10a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1-1z"/><path d="m16 10a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1-1z"/><path d="m8 10a1 1 0 0 0 -1 1v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 -1-1z"/></svg>
                    </button>
                </div>
            `
      })
      .join("")

    this.basketItemsContainer.innerHTML = basketItemsHtml

    this.updateTotal(data)
  }

  updateTotal(data) {
    if (!data || !data.length) {
      this.renderEmptyBasket()
      return
    }

    const totalPrice = data.reduce((sum, product) => {
      const { price } = product
      return sum + (price || 0)
    }, 0)
    this.renderTotal(totalPrice)
  }

  renderTotal(data) {
    if (!this.basketTotal) {
      return
    }
    this.basketTotal.innerHTML = `
            <div class="basket__total-info">
                <span class="basket__total-price">${data.toLocaleString("ru-RU")} ₽</span>
            </div>
        `
  }

  deleteProductBasket(event) {
    const targetButton = event.target.closest("[data-remove-id]")
    if (!targetButton) {
      return
    }

    const card = targetButton.closest("[data-product-id]")
    const id = card.dataset.productId

    card.style.transition = "all 0.3s ease"
    card.style.opacity = "0"

    setTimeout(() => {
      const basket = getBucketLocalStorage()
      const newBasket = basket.filter((item) => item !== id)
      setBucketLocalStorage(newBasket)
      this.refresh()

      document.dispatchEvent(
        new CustomEvent("basketItemRemoved", {
          detail: { removedId: id },
        }),
      )
      this.updateBasketButton()
    }, 300)
  }
}

export default BasketSystem
