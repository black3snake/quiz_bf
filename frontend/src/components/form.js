import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {

    constructor(page) {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;
        this.fields = [
            {
                name: "email",
                id: "email",
                element: null,
                regex: /^(?!.*\.\.)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                valid: false,
            },
            {
                name: "password",
                id: "password",
                element: null,
                regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                valid: false,
            }
        ];

        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: "name",
                    id: "name",
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false,
                },
                {
                    name: "lastName",
                    id: "last-name",
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false,
                }
            );
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateFields.call(that, item, this);
            }
        })

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }

        if (this.page === 'signup') {
            this.agreeElement = document.getElementById('agree');
            this.agreeElement.onchange = function () {
                that.validateForm()
            }
        }
    }

    validateFields(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }


    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }


    async processForm() {
        if (this.validateForm()) {
            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'name').element.value,
                        lastName: this.fields.find(item => item.name === 'lastName').element.value,
                        email: this.fields.find(item => item.name === 'email').element.value,
                        password: this.fields.find(item => item.name === 'password').element.value
                    } );

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }

                        // Auth.setTokens(result.accessToken, result.refreshToken);
                        location.href = '#/choice';
                    }
                } catch (error) {
                    console.log(error);
                }

            } else {
                try {
                    const result = await CustomHttp.request(config.host + '/login', 'POST', {
                        email: this.fields.find(item => item.name === 'email').element.value,
                        password: this.fields.find(item => item.name === 'password').element.value
                    } );

                    if (result) {
                        if (result.error || !result.accessToken || !result.refreshToken
                            || !result.fullName || !result.userId) {
                            throw new Error(result.message);
                        }

                        Auth.setTokens(result.accessToken, result.refreshToken);
                        location.href = '#/choice';
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}

