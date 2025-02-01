/** global: HTMLElement */

export default class RegisterView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML = `
            <header class="header">
                <page-header title="Register Account"></page-header>
            </header>
            <main class="main">
                <register-form></register-form>
            </main>`;
    }
}
