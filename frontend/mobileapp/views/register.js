export default class RegisterView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <page-title title="Account"></page-title>
                            </header>
                            <main class="main">
                                <register-form></register-form>
                            </main>
                            `;
    }
}
