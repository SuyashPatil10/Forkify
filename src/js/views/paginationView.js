import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            
            if(!btn) return;

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }

    generateMarkUpButtonNext(currentPage) {
        return `
            <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }

    generateMarkUpButtonPrev(currentPage) {
        return `
            <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
        `;
    }

    _generateMarkUp() {
        const currentPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // page 1, and there are other pages.
        if(currentPage === 1 && numPages > 1) {
            return this.generateMarkUpButtonNext(currentPage);   
        }

        // Last Page
        if(currentPage === numPages && numPages > 1){
            return this.generateMarkUpButtonPrev(currentPage);
        }

        // Other Page
        if(currentPage < numPages) {
            return `
                ${this.generateMarkUpButtonPrev(currentPage)}

                ${this.generateMarkUpButtonNext(currentPage)}
            `;
        }

        // Page 1, and there are NO other pages.
        return 'only page';
    }
}

export default new PaginationView();