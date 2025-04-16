import {UrlManager} from "../utils/url-manager.js";

export class Result {

    constructor() {
        this.logoElement = null;

        this.routerparams = UrlManager.getQueryParams();
        UrlManager.checkUserDataResult(this.routerparams);

        const correctAnswerElement = document.getElementById('correct');
        document.getElementById('result_score').innerText = this.routerparams.score + '/' +
            this.routerparams.total;

        correctAnswerElement.onclick = function () {
            location.href = '#/correct';
        }

        this.logoElement = document.getElementById("logo");
        this.logoElement.style.cursor = "pointer";
        this.logoElement.onclick = () => location.href = "#/"

    }
}




