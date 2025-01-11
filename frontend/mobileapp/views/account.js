export default class AccountView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML =    `<header class="header">
                                <page-header title="Account"></page-header>
                            </header>
                            <main class="padded-main">
                                <account-component></account-component>
                            </main>
                            `;
    }
}
