class CatalogFilter {
    selectors =  {
        root: '[data-js-catalog]',
        overlay: '[data-js-catalog-overlay]',
        button: '[data-js-catalog-button]'
    }

    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.overlayElement = this.rootElement.querySelector(this.selectors.overlay)
        this.buttonElement = this.rootElement.querySelector(this.selectors.button)
        this.bindEvent()
    }

    onFilter = () => {
        this.buttonElement.classList.toggle(this.stateClasses.isActive)
        this.overlayElement.classList.toggle(this.stateClasses.isActive)
    }

    bindEvent() {
        this.buttonElement.addEventListener('click',this.onFilter)
    }
}

export default CatalogFilter

