// Base components
import Router from "./router.js";
import Navigation from "./navigation.js";
import NotFound from "./views/not-found.js";

// Components
import PageTitle from "./components/page-title.js";
import LoginForm from "./components/login-form.js";
import RegisterForm from "./components/register-form.js";

// Views
import LoginView from "./views/login.js";
import MapView from "./views/map.js";
import RegisterView from "./views/register.js";

// Define base components
customElements.define('router-outlet', Router);
customElements.define('navigation-outlet', Navigation);
customElements.define('page-title', PageTitle);
customElements.define('not-found', NotFound);


customElements.define('login-view', LoginView);
customElements.define('login-form', LoginForm);

customElements.define('register-form', RegisterForm);
customElements.define('register-view', RegisterView);

customElements.define('map-view', MapView);
