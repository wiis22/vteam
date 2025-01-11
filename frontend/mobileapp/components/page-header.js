export default class PageHeader extends HTMLElement {
    constructor() {
        super();
    }

    // attribute change
    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        this[property] = newValue;
    }

    // connect component
    connectedCallback() {
        this.innerHTML = `
            <h1>${this.title}</h1>
        `;
    }
}
