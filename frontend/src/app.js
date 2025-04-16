import {Router} from "./router.js";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this)); // событие при изменении url
    }

    handleRouteChanging() {
        this.router.openRoute();
    }
}

(new App());
