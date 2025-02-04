/** global: HTMLElement */

export default class Router extends HTMLElement {
    constructor() {
        super();

        this.currentRoute = "";
        this.wildcard = "";

        this.allRoutes = {
            "": {
                view: "<map-view></map-view>",
                name: "Map",
                hidden: true,
            },
            "map": {
                view: "<map-view></map-view>",
                name: "Map",
            },
            "account": {
                view: "<account-view></account-view>",
                name: "Account",
            },
            "register": {
                view: "<register-view></register-view>",
                name: "Register",
                hidden: true,
            },
        };
    }

    get routes() {
        return this.allRoutes;
    }

    // connect component
    connectedCallback() {
        window.addEventListener('hashchange', () => {
            this.resolveRoute();
        });

        this.resolveRoute();
    }

    resolveRoute() {
        const routerOutlet = document.querySelector('router-outlet');
        let cleanHash = location.hash.replace("#", "");

        routerOutlet.classList.add("fade-in");
        setTimeout(() => {
            routerOutlet.classList.remove("fade-in");
        }, 400);

        this.wildcard = "";
        if (cleanHash.indexOf("/") > -1) {
            let splitHash = cleanHash.split("/");

            cleanHash = splitHash[0];
            this.wildcard = splitHash[1];
        }

        this.currentRoute = cleanHash;
        this.render();
    }

    render() {
        let html = "<not-found></not-found>";

        if (this.routes[this.currentRoute]) {
            html = this.routes[this.currentRoute].view;
            if (this.wildcard) {
                html = html.replace("$wildcard", this.wildcard);
            };
        };
        this.innerHTML = html;
    }
}
