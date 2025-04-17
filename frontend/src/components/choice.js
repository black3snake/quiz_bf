import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Choice {

    constructor() {
        this.quizzes = [];
        this.routerparams = UrlManager.getQueryParams();

        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/tests' );

            if (result) {
                if (result.error ) {
                    throw new Error(result.error);
                }
                this.quizzes = result;
                this.processQuizzes();
            } else  {
                location.href = '#/';
            }
        } catch (error) {
            console.log(error);
        }
    }

    processQuizzes() {
        const choiceOptionsElement = document.getElementById('choice-options');
        if (this.quizzes && this.quizzes.length > 0) {
            // console.log(this.quizzes);
            const that = this;
            this.quizzes.forEach(quiz => {
                const choiceOptionElement = document.createElement('div');
                choiceOptionElement.className = 'choice__option';
                choiceOptionElement.setAttribute('data-id', quiz.id);
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(this);
                }

                const choiceOptionTextElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice__option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice__option-arrow';

                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', '/images/arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'arrow');
                //соединяем
                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement);
            })
        }

    }

    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id');
        console.log(dataId);
        if (dataId) {
            location.href = "#/test?name=" + this.routerparams.name + '&lastName=' + this.routerparams.lastName
                + '&email=' + this.routerparams.email + "&id=" + dataId;
        }
    }
}


