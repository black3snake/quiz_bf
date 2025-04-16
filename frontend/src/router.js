import {Form} from "./components/form.js";
import {Choice} from "./components/choice.js";
import {Test} from "./components/test.js";
import {Result} from "./components/result.js";
import {Correct} from "./components/correct.js";

export class Router {
    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'styles/style.css',
                load: () => {
                }
            },
            {
                route: '#/form',
                title: 'Регистрация',
                template: 'templates/form.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form();
                }
            },
            {
                route: '#/choice',
                title: 'Выбор направления',
                template: 'templates/choice.html',
                styles: 'styles/choice.css',
                load: () => {
                    new Choice();
                }
            },
            {
                route: '#/test',
                title: 'Тестирование',
                template: 'templates/test.html',
                styles: 'styles/test.css',
                load: () => {
                    new Test();
                }
            },
            {
                route: '#/result',
                title: 'Результат',
                template: 'templates/result.html',
                styles: 'styles/result.css',
                load: () => {
                    new Result();
                }
            },
            {
                route: '#/correct',
                title: 'Правильные ответы',
                template: 'templates/correct.html',
                styles: 'styles/correct.css',
                load: () => {
                    new Correct();
                }
            },
        ];
    }

    async openRoute() {
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash.split('?')[0];
        })

        if (!newRoute) {
            window.location.href = '#/'
            return;
        }

        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('page-title').innerText = newRoute.title;
        newRoute.load();
    }
}