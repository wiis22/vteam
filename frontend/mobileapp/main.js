/** global: customElements */

// Base components
import Router from "./router.js";
import Navigation from "./navigation.js";
import NotFound from "./views/not-found.js";

// Components
import pageHeader from "./components/page-header.js";
import LoginForm from "./components/login-form.js";
import RegisterForm from "./components/register-form.js";
import Account from "./components/account.js";
import MapComponent from "./components/map.js";

// Views
import LoginView from "./views/login.js";
import MapView from "./views/map.js";
import RegisterView from "./views/register.js";
import AccountView from "./views/account.js";

// Define base components
customElements.define('router-outlet', Router);
customElements.define('navigation-outlet', Navigation);
customElements.define('page-header', pageHeader);
customElements.define('not-found', NotFound);

// Account
customElements.define('account-view', AccountView);
customElements.define('account-component', Account);

// Login
customElements.define('login-view', LoginView);
customElements.define('login-form', LoginForm);

// Register
customElements.define('register-form', RegisterForm);
customElements.define('register-view', RegisterView);

// Map
customElements.define('map-component', MapComponent);
customElements.define('map-view', MapView);

