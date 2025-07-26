import {ADD_VISIBLE_CARDS, VISIBLE_CARDS} from "./constants.js";

class CatalogShowMore {
    constructor() {
        this.showMore = document.querySelector('[data-js-catalog-showMore]')
        this.grid = document.querySelector('[data-js-catalog-grid]')
        this.cardArray= Array.from(document.querySelectorAll('[data-js-catalog-card]'))
        this.visibleCards = VISIBLE_CARDS;
        this.currentVisibleCards = this.visibleCards
        this.main()
    }

    main() {
        if (this.cardArray.length <= this.visibleCards) {
            this.showMore.style.display = 'none'
            return
        }

        this.showPage();

        this.showMore.addEventListener('click', () => this.showMorePages())

    }

    showPage() {
        this.cardArray.forEach((card,index) => {
           card.style.display = index < this.currentVisibleCards ? 'block' : 'none'
        });
    }

    showMorePages() {
        this.currentVisibleCards += ADD_VISIBLE_CARDS;
        if (this.currentVisibleCards >= this.cardArray.length ) {
            this.showMore.style.display = 'none'
        }

        this.showPage()


    }
}

export default CatalogShowMore;