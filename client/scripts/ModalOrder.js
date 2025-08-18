import {checkBucketValue, getBucketLocalStorage, setBucketLocalStorage, showErrorMessage} from "./utils.js";
import {
    ERROR_SERVER,
    NO_ITEMS_CART
} from "./constants.js";

class ModalOrder {
    constructor() {
        this.mainButton = document.querySelector('[data-js-button-goToModalOrder]');
        this.modalOrderOverlay = document.querySelector('[data-js-modalOrder-overlay]')
        this.modalOrderCount = document.querySelector('[data-js-modalOrder-count]');
        this.modalOrderPrice = document.querySelector('[data-js-modalOrder-price]');
        this.modalOrderItems = document.querySelector('[data-js-modalOrder-items]');
        this.urlApi = '/api'
        this.products = []
        this.getProducts()
        this.init()
    }
    init() {
        this.mainButton.addEventListener('click', (e) => {
            e.preventDefault()
            this.closeModalBasket()
            this.openModalOrder()
        })

        this.modalOrderOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOrderOverlay) {
                this.closeModalOrder()
            }
        })

    }

    openModalOrder() {
        this.modalOrderOverlay.classList.add('active');
        document.documentElement.classList.add('is-lock')
        this.refresh()
    }

    closeModalOrder() {
        this.modalOrderOverlay.classList.remove('active');
        document.documentElement.classList.remove('is-lock')
    }

    closeModalBasket() {
        document.querySelector('[data-js-basket-overlay]').classList.remove('active');
    }

    async getProducts() {
        try {
            const res = await fetch(`${this.urlApi}`)
            if (!res.ok) {throw new Error(res.statusText);}

            this.products = await res.json()
            this.loadProductsOrderModal(this.products)
        }
        catch(e) {
            showErrorMessage(ERROR_SERVER)
            console.log(e)
        }
    }

    loadProductsOrderModal(data) {
        if (!data || !data.length) {
            showErrorMessage(NO_ITEMS_CART)
            return
        }
        checkBucketValue(data)
        const basket = getBucketLocalStorage()

        const findProducts = data.filter(item => basket.includes(String(item.id)))


        this.renderModalOrder(findProducts)
    }

    refresh() {
        if (this.products && this.products.length) {
            this.loadProductsOrderModal(this.products);
        }
    }

    renderModalOrder(data) {
        if (!Array.isArray(data)) {
            console.error('Data should be an array');
            return;
        }

        const modalOrdertItemsHtml = data.map(product => {
            const {id, title, image, price} = product;

            return `
                <div class="basket__item" data-product-id="${id}">  
                    <div class="basket__item-image">
                        <img src="../icons/${image}" alt="${title}" width="100" height="100" />
                    </div>
                    <div class="basket__item-info">
                        <h3 class="basket__item-title">${title}</h3>                   
                        <div class="basket__item-price">${price} ₽</div>
                    </div>
           
                </div>
            `;
        }).join('');

        this.modalOrderItems.innerHTML = modalOrdertItemsHtml;
        this.updateTotal(data)
    }

    updateTotal(data) {
        const totalPrice = data.reduce((sum,product) => {
            const {price} = product;
            return sum + (price || 0)
        },0)
        const itemsCount = data.length

        this.renderTotal(totalPrice)
        this.renderCount(itemsCount)
    }

    renderTotal(data) {
        if (!this.modalOrderPrice) return
        this.modalOrderPrice.innerHTML = `
            <div class="basket__total-info">
                <span class="basket__total-price"> ${data.toLocaleString('ru-RU')} ₽</span>
            </div>
        `;
    }

    renderCount(data) {
        const countElement = document.querySelector('[data-js-modalOrder-count]');
        if (countElement) {
            countElement.textContent = data + ' шт.';
        }
    }
}

export default ModalOrder