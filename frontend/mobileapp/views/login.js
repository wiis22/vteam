/** global: HTMLElement */

export default class LoginView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML = `
            <header class="header">
                <page-header title="Account"></page-header>
            </header>
            <main class="main">
                <login-form></login-form>
            </main>`;
    }
}
