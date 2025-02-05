/** global: HTMLElement, localStorage */

export default class AccountView extends HTMLElement {
    // connect component
    connectedCallback() {
        // Check if user is logged in - if not, show login form
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.innerHTML = `
                <header class="header">
                    <page-header title="Account"></page-header>
                </header>
                <main class="padded-main fade-in">
                    <account-component></account-component>
                </main>`;
        } else {
            this.innerHTML = `
                <header class="header">
                    <page-header title="Login"></page-header>
                </header>
                <main class="padded-main fade-in">
                    <login-form></login-form>
                </main>`;
        }
    }
}
