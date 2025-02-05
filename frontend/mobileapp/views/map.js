/** global: HTMLElement */

export default class NotFoundView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML = `
            <main class="main">
                <map-component></map-component>
            </main>`;
    }
}
