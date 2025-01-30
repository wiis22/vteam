import Router from "./router.js";

export default class Navigation extends HTMLElement {
    constructor() {
        super();
        this.router = new Router();
    }

    // connect component
    connectedCallback() {
        const routes = this.router.routes;
        let navigationLinks = "";

        for (let path in routes) {
            if (routes[path].hidden) {
                continue;
            }
            navigationLinks += `<a href='#${path}' class='nav-link'>${routes[path].name}</a>`;
        }


        this.innerHTML = `<nav id="bottom-nav" class="bottom-nav">${navigationLinks}</nav>`;

        const links = this.querySelectorAll('.nav-link');

        links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetHash = link.getAttribute('href').substring(1);
                const currentHash = window.location.hash.substring(1);

                if (targetHash === currentHash) {
                    return;
                }

                const routerOutlet = document.querySelector('router-outlet');

                routerOutlet.classList.add("slide-out");
                setTimeout(() => {
                    routerOutlet.classList.remove("slide-out");
                    window.location.hash = targetHash;
                }, 300);
            });
        });
    }
}
