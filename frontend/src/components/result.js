import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";
// import '../../src/less/common.less';
// import '../../src/less/result.less';

export class Result {

    constructor() {
        this.logoElement = document.getElementById("logo");
        this.correctAnswerElement = document.getElementById('correct');
        this.resultScoreElement = document.getElementById('result_score');
        this.routerparams = UrlManager.getQueryParams();

        this.correctAnswerElement.onclick = () => {
            location.href = '#/correct?id=' + this.routerparams.id;
        }

        this.logoElement.style.cursor = "pointer";
        this.logoElement.onclick = () => location.href = "#/"

        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routerparams.id) {
            try {
                const result = await CustomHttp.request(config.host + /tests/ + this.routerparams.id +
                    '/result?userId=' + userInfo.userId );
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.resultScoreElement.innerText = result.score + '/' + result.total;
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = '#/';
    }

}




