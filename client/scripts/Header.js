class Header {
    selectors = {
        root: '[data-js-header]',
        overlay: '[data-js-overlay]',
        burgerButton: '[data-js-burger-button]'
    }

    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.overlayElement = this.rootElement.querySelector(this.selectors.overlay)
        this.burgerButtonElement = this.rootElement.querySelector(this.selectors.burgerButton)
        this.links = Array.from(this.rootElement.querySelectorAll('[data-js-header-link]'))
        this.bindEvents()
    }

    onBurgerButton = () => {
        this.burgerButtonElement.classList.toggle(this.stateClasses.isActive)
        this.overlayElement.classList.toggle(this.stateClasses.isActive)
        document.documentElement.classList.toggle(this.stateClasses.isLock)
    }

    bindEvents() {
        this.burgerButtonElement.addEventListener('click',this.onBurgerButton)
        this.links.forEach((item) => {
            item.addEventListener('click',() => this.onBurgerButton())
        })
    }

}



export default Header