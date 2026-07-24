class DetailsModal extends HTMLElement {
    constructor() {
        super();
        this.detailsContainer = this.querySelector('details');
        this.summaryToggle = this.querySelector('summary');

        if (!this.detailsContainer || !this.summaryToggle) return;

        this.detailsContainer.addEventListener(
            'keyup',
            (event) => event.code && event.code.toUpperCase() === 'ESCAPE' && this.close()
        );

        this.summaryToggle.addEventListener(
            'click',
            this.onSummaryClick.bind(this)
        );

        const closeButtons = this.querySelectorAll('.header-search-close, .search-modal__close-button');
        closeButtons.forEach((btn) => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.close();
            });
        });

        this.summaryToggle.setAttribute('role', 'button');
        this.summaryToggle.setAttribute('aria-expanded', 'false');
    }

    isOpen() {
        return this.detailsContainer.hasAttribute('open');
    }

    onSummaryClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.isOpen() ? this.close() : this.open(event);
    }

    onBodyClick(event) {
        if (!this.contains(event.target)) this.close(false);
    }

    open(event) {
        this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
        this.detailsContainer.setAttribute('open', 'true');
        this.summaryToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('sticky-search-open');
        document.documentElement.classList.add('sticky-search-open');

        const header = this.closest('[class*="section-header-"]');
        if (header) {
            header.classList.add('sticky-search-menu-open');
        }

        setTimeout(() => {
            const input = this.querySelector('input[type="search"], input[name="q"]');
            if (input) {
                input.focus();
            }
        }, 100);

        setTimeout(() => {
            document.body.addEventListener('click', this.onBodyClickEvent);
        }, 50);
    }

    close(focusToggle = true) {
        this.detailsContainer.removeAttribute('open');
        this.summaryToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('sticky-search-open');
        document.documentElement.classList.remove('sticky-search-open');

        const header = this.closest('[class*="section-header-"]');
        if (header) {
            header.classList.remove('sticky-search-menu-open');
        }

        document.body.removeEventListener('click', this.onBodyClickEvent);
    }
}

if (!customElements.get('details-modal')) {
    customElements.define('details-modal', DetailsModal);
}
