export default class NotFoundView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <page-title title="Page not Found"></page-title>
                            </header>
                            <main class="main">
                                <p>Sorry, the page you are looking for does not exist.</p>
                            </main>
                            `;
    }
}
