export default class LoginView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <page-title title="Account"></page-title>
                            </header>
                            <main class="main">
                                <login-form></login-form>
                            </main>
                            `;
    }
}
