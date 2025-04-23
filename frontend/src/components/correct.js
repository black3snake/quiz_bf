// import '../../src/less/common.less';
// import '../../src/less/correct.less';

import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Correct {

    constructor() {
        this.originalQuestions = null;
        this.questionsElement = null;
        this.levelElement = null;
        this.completeTestElement = null;
        this.questionOptionsElement = null;
        this.logoElement = null;
        this.backResult = null;
        this.logoElement = document.getElementById("logo");
        this.backResult = document.getElementById("back-result");

        this.routerparams = UrlManager.getQueryParams();
        this.userInfo = Auth.getUserInfo();
        if (!this.userInfo) {
            location.href = '#/';
        }

        this.questionsElement = document.getElementById("questions");
        this.levelElement = document.getElementById("level");

        this.completeTestElement = document.getElementById("complete-test");
        this.completeTestElement.innerHTML = `Тест выполнил <span>${this.userInfo.fullName}, ${this.userInfo.email}</span>`;

        this.logoElement.style.cursor = "pointer";
        this.logoElement.onclick = () => location.href = "#/"

        this.backResult.onclick = () => {
            location.href = '#/result?id=' + this.routerparams.id
        }

        this.start();

    }

    async start() {
        if (this.routerparams.id) {
            try {
                const result = await CustomHttp.request(config.host + /tests/ + this.routerparams.id +
                    '/result/details?userId=' + this.userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.originalQuestions = result;
                    this.levelElement.innerText = this.originalQuestions.test.name;
                    this.showQuestion();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    showQuestion() {
        const that = this;

        this.originalQuestions.test.questions.forEach((question, index) => {
            // console.log(question.question);
            const questionTitleString = `<span>Вопрос ${index + 1}:</span> ${question.question}`;
            const questionElement = document.createElement('div');
            questionElement.className = 'correctAnswer__question';

            const questionTitleElement = document.createElement('div');
            questionTitleElement.className = 'correctAnswer__question-title';
            questionTitleElement.innerHTML = questionTitleString;
            questionElement.appendChild(questionTitleElement);

            that.questionOptionsElement = document.createElement('div');
            that.questionOptionsElement.className = 'correctAnswer__question-options';

            question.answers.forEach(item => {
                const inputId = `answer-${item.id}`

                const questionOptionElement = document.createElement('div');
                questionOptionElement.className = 'correctAnswer__question-option';

                const fakeRadioElement = document.createElement('span');
                fakeRadioElement.className = 'correctAnswer__fake-radio';

                if (item.hasOwnProperty('correct')) {
                    item.correct === true ? fakeRadioElement.classList.add('success') : fakeRadioElement.classList.add('error');
                }

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = item.answer;

                questionOptionElement.appendChild(fakeRadioElement);
                questionOptionElement.appendChild(labelElement);
                that.questionOptionsElement.appendChild(questionOptionElement);

                // console.log(that.questionOptionsElement);
            })
            questionElement.appendChild(that.questionOptionsElement)
            that.questionsElement.appendChild(questionElement);
        })
    }
}

